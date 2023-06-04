export const getDate = () => {
    const date = new Date();
    const YEAR = date.getFullYear();
    const MONTH = date.getMonth() + 1;
    const DAY = date.getDate();
    return {
      YEAR, MONTH, DAY
    };
  };