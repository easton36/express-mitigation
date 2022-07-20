interface StoreItems{
    [key: string]: any
}

class Store{
    items: StoreItems;

    constructor(){
        this.items = {};
    }

    /**
     * Get an item from the store
     * @param {string} key - Stored item key
     * @returns {any}
    */
    public get(key: string): any{
        let item: any = this.items[key];

        return item;
    }

    /**
     * Set an item in the store
     * @param {string} key - Stored item key
     * @param {any} data - Data to store with the key
     * @param {number} expiry - Not required. Time in milliseconds for the key to expire
     * @returns {boolean}
    */
    public set(key: string, data: any, expiry?: number): boolean{
        this.items[key] = data;

        if(expiry && expiry > 0){
            setTimeout(()=>{
                this.delete(key)
            }, expiry);
        }

        return true;
    }

    /**
     * Delete an item from the store
     * @param {string} key - item key
     * @returns {boolean}
    */
    public delete(key: string): boolean{
        delete this.items[key];

        return true;
    } 
}

export default Store;