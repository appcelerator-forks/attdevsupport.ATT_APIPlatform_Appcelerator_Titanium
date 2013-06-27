
var isAndroid = (Titanium.Platform.osname === 'android');

module.exports = {
    isAndroid: isAndroid,
    margin: isAndroid ? 20 : 16,
    borderRadius: 8,
    font: {
        fontSize: 20,
        fontWeight: 'bold'
    }
};
