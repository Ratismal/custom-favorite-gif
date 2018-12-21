const { Plugin } = require('elements');

module.exports = class commands extends Plugin {
    /**
     * Contains all the loading logic, that does not depend on the DOM or other plugins
     */
    preload() {
        this.registerCommand({
            name: 'add-favorite-image',
            info: 'Adds a custom image to your favorite GIFs',
            func: this.addFavorite.bind(this)
        });
        this.registerCommand({
            name: 'add-favorite-images',
            info: 'Adds a list of custom images to your favorite GIFs',
            func: this.addFavorites.bind(this)
        });
    }
    /**
     * Contains all the loading logic, that does depend on the DOM or other plugins
     */
    async load() {
        this.log('Emoji-Backup has been loaded!');

        const hooks = this.DI.plugins.get('DI#hooks').instance;

        this.hook = await hooks.fetchModule(m => m.addFavoriteGIF && m.removeFavoriteGIF);
        this.messageHook = await hooks.fetchModule(m => m.sendClydeError);
        this.log('Loaded hook!');
    }

    /**
     * Stuff to do on unload (e.g. freeing resources, timers and event handlers)
     */
    unload() {
        this.log('Good night, sweet prince. Good night.');
    }

    async addFavorite([url, width = 100, height = 50]) {
        if (this.hook) {
            this.hook.addFavoriteGIF({
                url, src: url, width, height
            });
            this.messageHook.sendBotMessage(this.currentChannelID, 'That image has been added!');
        }
    }

    async addFavorites(urls) {
        if (this.hook) {
            let added = 0;
            console.log(urls);
            for (const url of urls) {
                this.hook.addFavoriteGIF({
                    url, src: url, width: 100, height: 50
                });
                added++;
            }
            
            this.messageHook.sendBotMessage(this.currentChannelID, `Added ${added} image(s)!`);
        }
    }

};