export function getUrlParam(name: any) {
  try {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.href.split("?")[1].match(reg);
    if (r != null) {
      return r[2];
    }
    return ""; // 如果此处只写return;则返回的是undefined
  } catch (e) {
    return ""; // 如果此处只写return;则返回的是undefined
  }
}

export function isQYWechat() {
  return /wxwork/i.test(window.navigator.userAgent) && getUrlParam("code");
}

export function deepClone(obj: any) {
  return new Promise((resolve, reject) => {
    try {
      const { port1, port2 } = new MessageChannel();
      port1.postMessage(obj);
      port2.onmessage = e => {
        resolve(e.data);
      };
      port1.close();
    } catch (e) {
      reject(e);
    }
  });
}
export function isEmpty(v: any) {
  if (typeof v === "undefined") {
    return true;
  }
  if (v === undefined || v === "undefined") {
    return true;
  }
  if (v === null) {
    return true;
  }
  if (v === "" || v === "null") {
    return true;
  }
  switch (typeof v) {
    case "string":
      if (v.trim().length === 0) {
        return true;
      }
      break;
    case "object":
      return Object.keys(v).length === 0;
  }
  return false;
}

type DebounceFunc = (...args: any[]) => void;

export function debounce(func: DebounceFunc, delay: number): DebounceFunc {
  let timer: NodeJS.Timeout;

  return (...args: any[]): void => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}