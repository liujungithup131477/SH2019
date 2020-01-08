import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducers/IndexReducers";

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

let store = null;
export default function configureStore(initialState) {
	store = createStoreWithMiddleware(rootReducer, initialState);
	return store;
}

export function getStore() {
	return store;
}
