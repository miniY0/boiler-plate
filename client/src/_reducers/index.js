import { combineReducers } from 'redux';
import user from './user_reducer';

// 여러 reducer를 합쳐서 rootReducer로 새로 만들어 사용
const rootReducer = combineReducers({
    user
})

export default rootReducer;