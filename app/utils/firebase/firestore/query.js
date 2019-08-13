import { isEmpty, isArray, isString } from 'lodash';
import { firestore } from "../factory";

function getCollection(collection) {
    return firestore().collection(collection);
}

function getDoc(collection, id) {
    return getCollection(collection).doc(id);
}

function addWhereToRef(ref, where) {
    if (!isArray(where)) {
      throw new Error('where parameter must be an array.');
    }

    if (isString(where[0])) {
      return where.length > 1 ? ref.where(...where) : ref.where(where[0]);
    }
  
    return where.reduce((acc, whereArgs) => addWhereToRef(acc, whereArgs), ref);
}

function addOrderByToRef(ref, orderBy) {
    if (!isArray(orderBy) && !isString(orderBy)) {
        throw new Error('orderBy parameter must be an array or string.');
    }
    
    if (isString(orderBy)) {
            return ref.orderBy(orderBy);
    }

    if (isString(orderBy[0])) {
        return ref.orderBy(...orderBy);
    }

    return orderBy.reduce(
        (acc, orderByArgs) => addOrderByToRef(acc, orderByArgs),
        ref,
    );
}

export function queryRef(query) {
    if((typeof query) !== "object") {
        throw new Error("Parameter must be an object !");
    }

    if(isEmpty(query.collection)) {
        throw new Error("Parameter must have a collection field !");
    }

    const { 
        collection,
        doc,
        orderBy,
        where,
        startAt,
        startAfter,
        endBefore,
        endAt,
        limit
    } = query;

    let ref = doc ? getDoc(collection, doc) : getCollection(collection);

    if (where) {
        ref = addWhereToRef(ref, where);
    }

    if (orderBy) {
        ref = addOrderByToRef(ref, orderBy);
    }

    if(startAt) {
        ref = ref.startAt(startAt);
    }

    if(startAfter) {
        ref = ref.startAfter(startAfter);
    }

    if(endBefore) {
        ref = ref.endBefore(endBefore); 
    }

    if(endAt) {
        ref = ref.endAt(endAt);
    }

    if(limit) {
        ref = ref.limit(limit);
    }

    return ref;
}