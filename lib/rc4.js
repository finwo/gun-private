// Basic RC4 implementation, I forgot where the code originally was based on
// If you recognize it, please let me know so I can credit the right person



// module.exports = function RC4(key) {
//
// };
//
// exports.RC4=function(key) {
//   key = ('string'===typeof key) ? htob(key) : key;
//   let i, x, y=0, t, x2, s=[];
//   for(i=0;i<256;i++) s[i]=i;
//   for(x=0;x<256;x++) {
//     y=(key[x % key.length] + s[x] + y) % 256;
//     t=s[x]; s[x]=s[y]; s[y]=t
//   }
//   x=y=0;
//   return function coder(data) {
//     if(Array.isArray(data)) return data.map(coder);
//     if('number'!==typeof data) return null;
//     x2=(x++)%256;y=(s[x2]+y)%256;
//     t=s[x2]; s[x2]=s[y]; s[y]=t;
//     return data ^ s[(s[x2] + s[y]) % 256]
//   }
// };
