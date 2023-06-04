import React, { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // 추후에 저장된 사용자 정보에서 nickname을 가져옴
    const user = JSON.parse(localStorage.getItem('user'));
    const nickname = user?.nickname;

    // 가져온 nickname을 사용하여 필요한 작업 수행
    console.log('Nickname:', nickname);
  }, []);

  return <div>My Component</div>;
}

export default MyComponent;
