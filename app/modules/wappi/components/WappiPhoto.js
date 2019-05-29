import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import MainView from '../../../core/layout/MainView';
import MainHeader from '../../../core/layout/MainHeader';
import { Icon, Text, Image } from 'react-native-elements';
import { setPaginationListener, unsetPaginatorListener, getStatus } from '../../../core/actions/actions';
import Spinner from '../../../core/layout/Spinner';
import { SALEPOINTS, SALEPOINTSPHOTOS, SALEPOINTSPHOTOSSTORAGE } from '../../../models/paths';
import { IMAGEPICKEROPTIONS, CONNEXION_PROBLEM_MSG } from '../../../core/constants';
import { toast } from '../../../utils/toast';
import { updateFile, uploadFile, add, update, createQuery } from '../../../utils/firebase';
import { getCurrentDate } from '../../../utils/helper';
import ConfirmModal from '../../../core/layout/ConfirmModal';

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

        this.query = createQuery({
            collection: SALEPOINTS + "/" + id + "/" + SALEPOINTSPHOTOS,
            orderBy: [['createdAt', 'DESC']],
            where: [['deleted', "==", false]],
            storeAs: 'photos'
        });
        
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
                toast("Erreur de chargement : vérifier votre appareil photo.", "warning", 5000);
            } else {
                const { id } = this.props;

                uploadFile(response.uri, SALEPOINTSPHOTOSSTORAGE + response.fileName)
                .then((url) => {
                    add(createQuery({collection: SALEPOINTS + "/" + id + "/" + SALEPOINTSPHOTOS}), {
                        url: url,
                        createdAt: getCurrentDate(),
                        deleted: false
                    }).then(() => {
                        this.setState({ isUploading: false });
                        toast("Cette photo a été éditée avec succès.", "success", 5000);
                    })
                    .catch((error) => {
                        this.setState({ isUploading: false });
                        toast(CONNEXION_PROBLEM_MSG, "danger", 7000)
                    });
                }).catch((error) => {
                    this.setState({ isUploading: false });
                    toast(CONNEXION_PROBLEM_MSG, "danger", 7000)
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
                toast("Erreur de chargement : vérifier votre appareil photo.", "warning", 5000);
            } else {
                const { id } = this.props;

                updateFile(response.uri, SALEPOINTSPHOTOSSTORAGE + response.fileName, oldUrl)
                .then((url) => {
                    const collection = SALEPOINTS + "/" + id + "/" + SALEPOINTSPHOTOS
                    update(createQuery({collection: collection, doc: photoId}), {
                        url: url
                    }).then(() => {
                        this.setState({ isUploading: false });
                        toast("Cette photo a été éditée avec succès.", "success", 5000);
                    })
                    .catch((error) => {
                        this.setState({ isUploading: false });
                        toast(CONNEXION_PROBLEM_MSG, "danger", 7000)
                    });
                }).catch((error) => {
                    this.setState({ isUploading: false });
                    toast(CONNEXION_PROBLEM_MSG, "danger", 7000)
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

        if(photoIdToDelete) {
            const { id } = this.props;
            const collection = SALEPOINTS + "/" + id + "/" + SALEPOINTSPHOTOS

            update(createQuery({collection: collection, doc: photoIdToDelete}), {
                deleted: true
            }).then(() => {
                this.setState({ isUploading: false });
                toast("Cette photo a été supprimée avec succès.", "success", 5000);
            })
            .catch((error) => {
                this.setState({ isUploading: false });
                toast(CONNEXION_PROBLEM_MSG, "danger", 7000)
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
                    <Text style={{color: 'white'}}>Aucune photo trouvée</Text>
                </View>
            );
        } else {
            const { data, willPaginate } = photos;
            const { setPaginationListener } = this.props;

            return (
                <FlatList numColumns={3}
                    contentContainerStyle={{marginHorizontal: 10, marginTop: 15, marginBottom: 5}}
                    keyExtractor={(item, index) => item.id}
                    data={data}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if(willPaginate === true) {
                            setPaginationListener(this.query);
                        }
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
                        containerStyle={isUploading ? { ...styles.addButtonContainer, marginLeft: "30%" } : { ...styles.addButtonContainer, marginLeft: "85%" }}
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
    photos: state.firestorePaginator.photos
});

export default connect(mapStateToProps, { setPaginationListener, unsetPaginatorListener })(WappiPhoto);