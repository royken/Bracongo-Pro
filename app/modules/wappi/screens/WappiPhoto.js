import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { Icon, Text, Image } from 'react-native-elements';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import { 
    setPaginationListener, 
    unsetPaginatorListener, 
    getStatus, getData 
} from '../../../store/actions';
import { toast } from '../../../utils/toast';
import { updateFile, uploadFile, add, update, remove } from '../../../utils/firebase';

import { SALEPOINTSPHOTOS, SALEPOINTSPHOTOSSTORAGE } from '../../../models/paths';
import { IMAGEPICKEROPTIONS, CONNEXION_PROBLEM_MSG } from '../../core/constants';

import MainView from '../../core/layout/MainView';
import MainHeader from '../../core/layout/MainHeader';
import ConfirmModal from '../../core/layout/ConfirmModal';
import Spinner from '../../core/layout/Spinner';

const deviceWidth = Dimensions.get('window').width;
const imageWidth = Math.floor(deviceWidth / 3) - 40

class WappiPhoto extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isUploading: false,
            isConfirmModalVisible: false,
            isConfirmProcessing: false,
            photoIdToDelete: null
        };

        this.query = null;
    }

    componentDidMount() {
        const { setPaginationListener, id } = this.props;

        this.query = {
            collection: SALEPOINTSPHOTOS,
            orderBy: [['createdAt', 'DESC']],
            where: [['salepointId', "==", id], ['deleted', "==", false]],
            storeAs: 'photos'
        };
        
        setPaginationListener(this.query);
    }

    componentWillUnmount() {
        if(this.query) {
            const { unsetPaginatorListener } = this.props;
            unsetPaginatorListener(this.query);
        }
    }

    _uploadPhoto() {
        this.setState({ isUploading: true });

        ImagePicker.showImagePicker(IMAGEPICKEROPTIONS, (response) => {
            if(response.didCancel){
                this.setState({ isUploading: false });
            } else if(response.error){
                this.setState({ isUploading: false });
                toast.warning("Erreur de chargement : v??rifier votre appareil photo.");
            } else {
                const { id, numero } = this.props;

                uploadFile(response.uri, SALEPOINTSPHOTOSSTORAGE + response.fileName)
                .then((url) => {
                    add({collection: SALEPOINTSPHOTOS}, {
                        salepointId: id,
                        numero: numero,
                        url: url,
                    }).then(() => {
                        this.setState({ isUploading: false });
                        toast.success("Cette photo a ??t?? ??dit??e avec succ??s.");
                    })
                    .catch((error) => {
                        this.setState({ isUploading: false });
                        toast.danger(CONNEXION_PROBLEM_MSG)
                    });
                }).catch((error) => {
                    this.setState({ isUploading: false });
                    toast.danger(CONNEXION_PROBLEM_MSG)
                });
            }
        });
    }

    _editPhoto(photoId, oldUrl) {
        this.setState({ isUploading: true });
        
        ImagePicker.showImagePicker(IMAGEPICKEROPTIONS, (response) => {
            if(response.didCancel){
                this.setState({ isUploading: false });
            } else if(response.error){
                this.setState({ isUploading: false });
                toast.warning("Erreur de chargement : v??rifier votre appareil photo.");
            } else {
                updateFile(response.uri, SALEPOINTSPHOTOSSTORAGE + response.fileName, oldUrl)
                .then((url) => { 
                    update({collection: SALEPOINTSPHOTOS, doc: photoId}, {
                        url: url
                    }).then(() => {
                        this.setState({ isUploading: false });
                        toast.success("Cette photo a ??t?? ??dit??e avec succ??s.");
                    })
                    .catch((error) => {
                        this.setState({ isUploading: false });
                        toast.danger(CONNEXION_PROBLEM_MSG);
                    });
                }).catch((error) => {
                    this.setState({ isUploading: false });
                    toast.danger(CONNEXION_PROBLEM_MSG);
                });
            }
        });
    }

    _showFormConfirm(photoId) {
        this.setState({ isConfirmModalVisible: true, photoIdToDelete: photoId });
    }

    _hideFormConfirm = () => {
        this.setState({ isConfirmModalVisible: false, isConfirmProcessing: false, photoIdToDelete: null });
    }

    _deletePhoto = () => {
        const { photoIdToDelete } = this.state;
        this.setState({ isConfirmProcessing: true });
        
        if(photoIdToDelete) { 
            remove({collection: SALEPOINTSPHOTOS, doc: photoIdToDelete}).then(() => {
                this._hideFormConfirm();
                toast.success("Cette photo a ??t?? supprim??e avec succ??s.");
            })
            .catch((error) => {
                this.setState({ isConfirmProcessing: false });
                toast.danger(CONNEXION_PROBLEM_MSG);
            });
        }
    }

    _renderItem = ({item, index}) => { 
        return (
            <View style={styles.imageContainerStyle}>
                <Image 
                    source={{uri: item.url}}
                    onError={() => {}}
                    style={styles.imageStyle}
                />
                <View style={styles.imageActionStyle}>
                    <Icon 
                        type="font-awesome"
                        name="pencil"
                        iconStyle={{color: 'white'}}
                        onPress={() => this._editPhoto(item.id, item.url)}
                    />
                    <Icon 
                        type="font-awesome"
                        name="trash"
                        iconStyle={{color: 'red'}}
                        onPress={() => this._showFormConfirm(item.id)}
                    />
                </View>
            </View>
        );
    }

    _loadPhotos(photos) {
        const { isLoaded, isEmpty } = getStatus(photos);

        if(!isLoaded) {
            return (
                <Spinner  
                    color="blue" 
                    containerStyle={{alignItems: 'center', marginTop: "50%"}} 
                /> 
            );
        } else if(isEmpty) {
            return (
                <View style={{alignItems: 'center', marginTop: "50%"}}>
                    <Text style={{color: 'white'}}>Aucune photo trouv??e</Text>
                </View>
            );
        } else {
            const data = getData(photos);
            const { setPaginationListener } = this.props;

            return (
                <FlatList numColumns={3}
                    contentContainerStyle={{marginHorizontal: 10, marginTop: 15, marginBottom: 5}}
                    keyExtractor={(item, index) => item.id}
                    data={data}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        setPaginationListener(this.query, true);
                    }}
                />
            );
        }
    }

    render() {
        const { navigation, photos } = this.props;
        const { isUploading, isConfirmModalVisible, isConfirmProcessing } = this.state;

        return (
            <MainView containerStyle={{paddingBottom: 10}}
                backgroundImageUri={require('../../../assets/images/background_line_bottom.png')}>
                <MainHeader 
                    title="photos"
                    uri={require('../../../assets/images/wappi.png')}
                    navigation={navigation}
                    containerStyle={{marginTop: '7%'}}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {isUploading &&
                        <Spinner color="blue" 
                            containerStyle={{alignItems: 'center', marginLeft: "47%"}}
                        />
                    }
                    <Icon 
                        type="font-awesome"
                        name="plus"
                        iconStyle={{color: '#7B7C9E'}}
                        containerStyle={isUploading ? { ...styles.addButtonContainer, marginLeft: wp("27%") } : { ...styles.addButtonContainer, marginLeft: wp("85%") }}
                        onPress={() => this._uploadPhoto()}
                    />
                </View>
                <ConfirmModal 
                    title="Voulez-vous vraiment effectuer cette suppression ?"
                    isVisible={isConfirmModalVisible}
                    isLoading={isConfirmProcessing}
                    hideForm={this._hideFormConfirm}
                    handleConfirm={this._deletePhoto}
                />
                {this._loadPhotos(photos)}
            </MainView>
        );
    }
}

const styles = StyleSheet.create({
    addButtonContainer: {
        height: 40, 
        width: 40, 
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 10
    },
    imageContainerStyle: {
        borderRadius: 5,
        marginVertical: 10,
        marginLeft: "7%"
    },
    imageStyle: {
        width: imageWidth,
        height: imageWidth,
        backgroundColor: 'grey'
    },
    imageActionStyle: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        margin: 10,
        height: 30
    }
});

const mapStateToProps = (state) => ({
    id: state.profile.id,
    numero: state.profile.numero,
    photos: state.firestorePaginator.photos
});

const mapActionsToProps = { setPaginationListener, unsetPaginatorListener };

export default connect(mapStateToProps, mapActionsToProps)(WappiPhoto);