
var contacts = {
    createDownloadPrompt: function() {
        var downloadContactsPrompt = Ti.UI.createAlertDialog({
            cancel: 1,
            buttonNames: ['YES', 'NO'],
            message: 'Contacts list was not downloaded properly, would you like to try again?',
            title: 'Download Contacts'
        })
        ,   self = this;
        
        downloadContactsPrompt.addEventListener('click', function(e){
            if (e.index === 0) {
                self.fetch();
            }
        });
        downloadContactsPrompt.show();
    },
    fetch: function(successCB, errorCB) {
        if(this.list) {
            if(successCB) successCB(this.list);
            return; 
        }
        
        var xhr = Ti.Network.createHTTPClient({ timeout: 10000 }), self = this;
        xhr.open('GET', self.fetch.url, true);
        xhr.onload = function() {
            self.list = JSON.parse(xhr.responseText).Contacts;
            if(successCB) successCB.call(this, self.list);
        };
        xhr.onerror = function() {
            var noPrompt = errorCB && errorCB.call(this, xhr.responseText);
            if(!noPrompt) self.createDownloadPrompt();
        };
        xhr.send();
    },
    /*
    filter: function(name) {
        if(!this.list) return [];
        
        name = name.replace('.!,', '').toLowerCase();  //Strip punctuation out and set to lower case
        return this.list.filter(function(contact) {
            return (contact.name.toLowerCase().indexOf(name) >= 0);
        });
    },
    */
    filter: function(names) {
        if(!this.list) return [];
        
        return this.list.filter(function(contact) {
            return names.indexOf(contact.name) >= 0;
        });
    },
    getGrammar: function() {
        var grammarText = '<grammar root="' + this.id + '" xml:lang="en-US"><rule id="' + this.id + '"><one-of>';
        
        this.list.forEach(function(contact) {
            grammarText += '<item>' + contact.name + '</item>';
        });
    
        return grammarText + '</one-of></rule></grammar>';
    }
};
contacts.fetch.url = 'https://ldev.code-api-att.com/ATTDPSDEMO/contacts.json';
contacts.id = 'CONTACTS';

module.exports = contacts;

