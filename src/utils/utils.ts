export const processText = (s: string) => {
  let result = '';

  for (let i = 0; i < s.length; i++) {
    if (s[i] == '\n') {
      result += '<br/>';
    } else result += s[i];
  }
  return result;
};
export const formatMathExpr = (s: string) => {
  let rs = '',
    isInMathExp = false;

  for (let i = 0; i < s.length; i++) {
    if (s[i] == '~' || s[i] == '$') {
      if (!isInMathExp) {
        rs += '<span style="font-weight:bold">' + '\\(';
      } else rs += '\\)' + '</span>';
      isInMathExp = !isInMathExp;
    } else rs += s[i];
  }
  return rs;
};

export const getAvatarLink = (username: string) => {
  return `https://avatar.oxro.io/avatar.svg?name=${username}&length=2`;
};

export const getSummary = (str: string, limitCharacter: number) => {
  const lst = str.split(' ');
  let result = '',
    i = 0;
  for (i = 0; i < lst.length; i++) {
    if (result.length + 1 + lst[i].length > limitCharacter) {
      return result + '...';
    } else result += ' ' + lst[i];
  }
  return result;
};

export const calColor = (result: string) => {
  if (result === 'JUDGING' || result === 'PENDING') return 'gray';
  if (result === 'ACCEPTED') return 'green';
  if (result === 'WRONG_ANSWER') return 'red';
  return 'blue';
};
export const CHAT_MESSAGE_TYPE = {
  TEXT_MESSAGE: 1,
  SHARE_MESSAGE: 2
};

export const processChatMessage = (chatMessage: string) => {
  try {
    const msg = JSON.parse(chatMessage);
    if (msg.type == CHAT_MESSAGE_TYPE.TEXT_MESSAGE) {
      return { type: CHAT_MESSAGE_TYPE.TEXT_MESSAGE, content: msg.content };
    }
    if (msg.type == CHAT_MESSAGE_TYPE.SHARE_MESSAGE) {
      return {
        type: CHAT_MESSAGE_TYPE.SHARE_MESSAGE,
        share: msg.share
      };
    }
    return { type: 1, content: chatMessage };
  } catch (error) {
    return { type: CHAT_MESSAGE_TYPE.TEXT_MESSAGE, content: chatMessage };
  }
};
