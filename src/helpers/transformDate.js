/* eslint-disable default-case */
export const transformDate = (date) => {
    let dateObj = new Date(date);
    let month = dateObj.getMonth();

    switch (month) {
        case 0:
            month = 'Sty';
            break;
        case 1:
            month = 'Lut';
            break;
        case 2:
            month = 'Mar';
            break;
        case 3:
            month = 'Kwt';
            break;
        case 4:
            month = 'Maj';
            break;
        case 5:
            month = 'Cze';
            break;
        case 6:
            month = 'Lip';
            break;
        case 7:
            month = 'Sie';
            break;
        case 8:
            month = 'Wrz';
            break;
        case 9:
            month = 'Paź';
            break;
        case 10:
            month = 'Lis';
            break;
        case 11:
            month = 'Gru';
    }
    return dateObj.getHours() +
        ':' + dateObj.getMinutes() +
        ' - ' + dateObj.getDate() +
        ' ' + month +
        ' ' + dateObj.getFullYear();
}