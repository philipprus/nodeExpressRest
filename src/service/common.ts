import uuidv4 from 'uuid/v4';

export const addUuidToArray = (arr: any[]) => {

    arr.forEach( a => {
        a.id = uuidv4();
    });

    return arr;
};