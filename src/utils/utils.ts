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
    if (s[i] == '~') {
      if (!isInMathExp) {
        rs += '<span style="font-weight:bold">' + '\\(';
      } else rs += '\\)' + '</span>';
      isInMathExp = !isInMathExp;
    } else rs += s[i];
  }
  return rs;
};

export const getAvatarLink = (username: string) =>{
  return `https://avatar.oxro.io/avatar.svg?name=${username}&length=3`;
}

export const getSummary = (str: string, limitCharacter : number) =>{
  const lst = str.split(' ');
  let result = "";
  for(let i=0;i<lst.length;i++) {
    if(result.length + 1+ lst[i].length > limitCharacter) {
      return result;
    }
    else result+= (' '+ lst[i]);
  }
  return result;
}