import * as React from 'react';

export function generateId(length = 30) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export class Auth {
  storageKey = 'accessToken';

  /**
   *
   * @param {string|null} accessToken
   */
  setAccessToken(accessToken) {
    sessionStorage.setItem(this.storageKey, accessToken);
  }

  getAccessToken() {
    return sessionStorage.getItem(this.storageKey)
  }

  /**
   * get is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!sessionStorage.getItem(this.storageKey)
  }

  delAccessToken() {
    sessionStorage.removeItem(this.storageKey);
  }
}

export function useQueue(initial) {
  initial = initial || [];
  if (!Array.isArray(initial)) {
    throw new Error('useQueue initial must be array');
  }
  const [queue, setQueue] = React.useState(initial);
  
  const enqueue = React.useCallback((item) => {
    setQueue(prevState => [...prevState, item]);
  }, [queue]);
  
  const dequeue = React.useCallback(() => {
    if (queue.length) {
      const item = queue[0];
      setQueue([...queue.slice(1)]);
      return item;
    }
    return undefined;
  }, [queue])
  
  return [queue, {enqueue, dequeue}];
}
