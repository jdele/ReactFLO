// dec variables to hold react global hook 
//declare const window: any;
import { childOrSibling } from './dataCollection';
import { addToArray } from './dataCollection'
declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  }
}

const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
const reactInstance = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers;
const instance = reactInstance.get(1);

export const initialHook = () => {

  if (instance && instance.version) {
    let test;
    devTools.onCommitFiberRoot = (function (original) {
      return function (...args) {
        test = args[1].current;
        console.log('DOM: ', test);
        console.log('Test: ', childOrSibling(test));
        // console.log(addToArray(test));
        return original(...args);
      };
    })(devTools.onCommitFiberRoot);
  }

  /* ~~~~~~ Checking to see if React version is older than 16 ~~~~~~ */
  // else if (instance && instance.Reconciler) {
  //   instance.Reconciler.receiveComponent = (function (original) {
  //     return function (...args) {
  //         setTimeout(() => {
  //           console.log(instance.reconciler);
  //         }, 10);
  //       return original(...args);
  //     };
  //   })(instance.Reconciler.receiveComponent); 
  // }
}

//export default initialHook;