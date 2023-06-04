// 예시 리듀서
const initialState = {
    // 초기 상태 정의
    // 예: counter: 0, user: null
  };
  
  function rootReducer(state = initialState, action) {
    switch (action.type) {
      // 액션 타입에 따라 상태 변화 처리
      // 예: case 'INCREMENT': return { ...state, counter: state.counter + 1 };
      default:
        return state;
    }
  }
  
  export default rootReducer;
  