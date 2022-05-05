import Data from './data'


class Store {
    d = new Data(this);

    constructor () {
        this.d.init();
    }
}

const store = new Store();

export default store;