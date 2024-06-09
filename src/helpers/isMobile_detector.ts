const mobile_list = ['iphone', 'android', 'ipad', 'samsung', 'windows phone', 'mobile'];

export const mobileDetector = (agent: string) => {
  let res = false;
  mobile_list.forEach((el) => {
    if (agent.toLowerCase().includes(el)) {
      res = true;
    }
  });
  return res;
};
