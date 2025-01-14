const developer = "@yoshx/func",
  axios = require("axios"),
  fetch = require("node-fetch"),
  crypto = require("crypto"),
  fs = require("fs"),
  moment = require("moment-timezone"),
  { read, MIME_JPEG, RESIZE_BILINEAR, AUTO } = require("jimp");

module.exports = class Function {
  date = () => {
    let d = new Date(new Date() + 3600000);
    let locale = "id";
    let week = d.toLocaleDateString(locale, {
      weekday: "long",
    });
    let date = d.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    let tgl = `${week}, ${date}`;
    return tgl;
  };

  readMore = () => {
    let More = String.fromCharCode(8206).repeat(4001);
    return More;
  };

  clockString = (ms) => {
    let d = isNaN(ms) ? "--" : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [d, " Day ", h, " hours ", m, " Minutes ", s, " Second "]
      .map((v) => v.toString().padStart(2, "0"))
      .join("");
  };

  generateProfilePicture = async (buffer) => {
    const jimp = await read(buffer);
    const min = jimp.getWidth();
    const max = jimp.getHeight();
    const cropped = jimp.crop(0, 0, min, max);
    return {
      img: await cropped.scaleToFit(720, 720).getBufferAsync(MIME_JPEG),
      preview: await cropped.scaleToFit(720, 720).getBufferAsync(MIME_JPEG),
    };
  };

  listAdmin = (participants) => {
    let admins = [];
    for (let i of participants) {
      i.admin === "superadmin"
        ? admins.push(i.id)
        : i.admin === "admin"
          ? admins.push(i.id)
          : "";
    }
    return admins || [];
  };

  generateRandomString = (length) => {
    const characters = "abcdef0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  generateRandomNumberString = (length) => {
    const characters = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  };

  generateRandomUserAgent = () => {
    const androidVersions = [
      "4.0.3",
      "4.1.1",
      "4.2.2",
      "4.3",
      "4.4",
      "5.0.2",
      "5.1",
      "6.0",
      "7.0",
      "8.0",
      "9.0",
      "10.0",
      "11.0",
    ];
    const deviceModels = [
      "M2004J19C",
      "S2020X3",
      "Xiaomi4S",
      "RedmiNote9",
      "SamsungS21",
      "GooglePixel5",
    ];
    const buildVersions = [
      "RP1A.200720.011",
      "RP1A.210505.003",
      "RP1A.210812.016",
      "QKQ1.200114.002",
      "RQ2A.210505.003",
    ];
    const selectedModel =
      deviceModels[Math.floor(Math.random() * deviceModels.length)];
    const selectedBuild =
      buildVersions[Math.floor(Math.random() * buildVersions.length)];
    const chromeVersion =
      "Chrome/" +
      (Math.floor(Math.random() * 80) + 1) +
      "." +
      (Math.floor(Math.random() * 999) + 1) +
      "." +
      (Math.floor(Math.random() * 9999) + 1);
    const userAgent = `Mozilla/5.0 (Linux; Android ${androidVersions[Math.floor(Math.random() * androidVersions.length)]}; ${selectedModel} Build/${selectedBuild}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Mobile Safari/537.36 WhatsApp/1.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`;
    return userAgent;
  };

  shortlink = async (url) => {
    let isurl = /https?:\/\//.test(url);
    return isurl
      ? (
          await axios.get(
            "https://tinyurl.com/api-create.php?url=" + encodeURIComponent(url),
          )
        ).data
      : "";
  };

  generateRandomIP = () => {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
  };

  generateUUIDv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16),
    );
  };

  randomBytes = (length) => {
    return crypto.randomBytes(length);
  };

  generateMessageID = () => {
    return this.randomBytes(10).toString("hex").toUpperCase();
  };

  getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
  };

  ebinary = (binary) => {
    return binary
      .split(" ")
      .map((bin) => String.fromCharCode(parseInt(bin, 2)))
      .join("");
  };

  binary = (text) => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
  };

  parseMention = (text = "") => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
      (v) => v[1] + "@s.whatsapp.net",
    );
  };

  reverseText = (text) => {
    return text.split("").reverse().join("");
  };

  delay = (time) => new Promise((res) => setTimeout(res, time));

  createThumb = async (source) => {
    let { file } = await this.getFile(source);
    let jimp = await read(await this.fetchBuffer(file));
    let buff = await jimp
      .quality(100)
      .resize(200, AUTO, RESIZE_BILINEAR)
      .getBufferAsync(MIME_JPEG);
    return buff;
  };

  isUrl = (url) => {
    return url.match(
      new RegExp(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/,
        "gi",
      ),
    );
  };

  fetchJson = async (url, head = {}) => {
    try {
      const result = await (
        await fetch(url, {
          headers: head,
        })
      ).json();
      return result;
    } catch (e) {
      return {
        developer,
        status: false,
      };
    }
  };

  fetchBuffer = async (file, options = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.isUrl(file)) {
          let buff = await (
            await axios.get(file, {
              responseType: "arraybuffer",
              headers: options,
            })
          ).data;
          resolve(buff);
        } else {
          let buff = fs.readFileSync(file);
          resolve(buff);
        }
      } catch {
        return {
          developer,
          status: false,
        };
      }
    });
  };

  fetchText = async (url, options = {}) => {
    try {
      let data = await axios.get(url, {
        headers: {
          ...(!!options.headers ? options.headers : {}),
        },
        responseType: "text",
        ...options,
      });
      return await data?.data;
    } catch (e) {
      return {
        developer,
        status: false,
      };
    }
  };

  sort = (property, ascending = true) => {
    if (property)
      return (...args) =>
        args[ascending & 1][property] - args[!ascending & 1][property];
    else return (...args) => args[ascending & 1] - args[!ascending & 1];
  };

  toNumber = (property, _default = 0) => {
    if (property)
      return (a, i, b) => {
        return {
          ...b[i],
          [property]: a[property] === undefined ? _default : a[property],
        };
      };
    else return (a) => (a === undefined ? _default : a);
  };

  enumGetKey = (a) => {
    return a.jid;
  };

  parseCookie = async (file, options = {}) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cookie = await (
          await axios.get(file, {
            responseType: "arraybuffer",
            headers: options,
          })
        ).headers["set-cookie"];
        resolve(cookie);
      } catch {
        return {
          developer,
          status: false,
        };
      }
    });
  };

  texted = (type, text) => {
    switch (type) {
      case "dot":
        return "- " + text;
        break;
      case "gray":
        return "> " + text;
        break;
      case "glow":
        return "`" + text + "`";
        break;
      case "bold":
        return "*" + text + "*";
        break;
      case "italic":
        return "_" + text + "_";
        break;
      case "monospace":
        return "```" + text + "```";
    }
  };

  example = (usedPrefix, command, text) => {
    return `${this.texted("bold", "Wrong Input")}\n~ Example : ${usedPrefix + command} ${text}`;
  };

  toTime = (ms) => {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map((v) => v.toString().padStart(2, 0)).join(":");
  };

  filename = (extension) => {
    return `${Math.floor(Math.random() * 10000)}.${extension}`;
  };

  uuid = () => {
    let dt = new Date().getTime();
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        let y = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
    return uuid;
  };

  random = (list) => {
    return list[Math.floor(Math.random() * list.length)];
  };

  randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  formatter = (integer) => {
    let numb = parseInt(integer);
    return Number(numb).toLocaleString().replace(/,/g, ".");
  };

  formatNumber = (integer) => {
    let numb = parseInt(integer);
    return Number(numb).toLocaleString().replace(/,/g, ".");
  };

  h2k = (integer) => {
    let numb = parseInt(integer);
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(numb);
  };

  formatSize = (size) => {
    function round(value, precision) {
      let multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }
    let megaByte = 1024 * 1024;
    let gigaByte = 1024 * megaByte;
    let teraByte = 1024 * gigaByte;
    if (size < 1024) {
      return size + " B";
    } else if (size < megaByte) {
      return round(size / 1024, 1) + " KB";
    } else if (size < gigaByte) {
      return round(size / megaByte, 1) + " MB";
    } else if (size < teraByte) {
      return round(size / gigaByte, 1) + " GB";
    } else {
      return round(size / teraByte, 1) + " TB";
    }
    return "";
  };

  getSize = async (str) => {
    if (!isNaN(str)) return this.formatSize(str);
    let header = await (await axios.get(str)).headers;
    return this.formatSize(header["content-length"]);
  };

  mtype = (data) => {
    function replaceAll(str) {
      let res = str
        .replace(new RegExp("```", "g"), "")
        .replace(new RegExp("_", "g"), "")
        .replace(new RegExp(/[*]/, "g"), "");
      return res;
    }
    let type = typeof data.text !== "object" ? replaceAll(data.text) : "";
    return type;
  };

  sizeLimit = (str, max) => {
    let data;
    if (str.match("G") || str.match("GB") || str.match("T") || str.match("TB"))
      return (data = {
        oversize: true,
      });
    if (str.match("M") || str.match("MB")) {
      let first = str.replace(/MB|M|G|T/g, "").trim();
      if (isNaN(first))
        return (data = {
          oversize: true,
        });
      if (first > max)
        return (data = {
          oversize: true,
        });
      return (data = {
        oversize: false,
      });
    } else {
      return (data = {
        oversize: false,
      });
    }
  };

  generateLink = (text) => {
    let regex =
      /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
    return text.match(regex);
  };

  jsonFormat = (obj) => {
    try {
      let print =
        obj &&
        (obj.constructor.name == "Object" || obj.constructor.name == "Array")
          ? require("util").format(JSON.stringify(obj, null, 2))
          : require("util").format(obj);
      return print;
    } catch {
      return require("util").format(obj);
    }
  };

  ucword = (str) => {
    return (str + "").replace(/^([a-z])|\s+([a-z])/g, function ($1) {
      return $1.toUpperCase();
    });
  };

  arrayJoin = (arr) => {
    let construct = [];
    for (let i = 0; i < arr.length; i++) construct = construct.concat(arr[i]);
    return construct;
  };

  removeItem = (arr, value) => {
    let index = arr.indexOf(value);
    if (index > -1) arr.splice(index, 1);
    return arr;
  };

  socmed = (url) => {
    const regex = [
      /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/,
      /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/,
      /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/,
      /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:s\/)(?:\S+)?$/,
      /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/,
      /pin(?:terest)?(?:\.it|\.com)/,
      /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/,
      /http(?:s)?:\/\/(?:www\.|mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
      /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/,
      /^(?:https?:\/\/)?(?:podcasts\.)?(?:google\.com\/)(?:feed\/)(?:\S+)?$/,
    ];
    return regex.some((v) => url.match(v));
  };

  matcher = (string, array, options) => {
    function levenshtein(value, other, insensitive) {
      let cache = [];
      let codes = [];
      let length;
      let lengthOther;
      let code;
      let result;
      let distance;
      let distanceOther;
      let index;
      let indexOther;
      if (value === other) {
        return 0;
      }
      length = value.length;
      lengthOther = other.length;
      if (length === 0) {
        return lengthOther;
      }
      if (lengthOther === 0) {
        return length;
      }
      if (insensitive) {
        value = value.toLowerCase();
        other = other.toLowerCase();
      }
      index = 0;
      while (index < length) {
        codes[index] = value.charCodeAt(index);
        cache[index] = ++index;
      }
      indexOther = 0;
      while (indexOther < lengthOther) {
        code = other.charCodeAt(indexOther);
        result = distance = indexOther++;
        index = -1;
        while (++index < length) {
          distanceOther = code === codes[index] ? distance : distance + 1;
          distance = cache[index];
          cache[index] = result =
            distance > result
              ? distanceOther > result
                ? result + 1
                : distanceOther
              : distanceOther > distance
                ? distance + 1
                : distanceOther;
        }
      }
      return result;
    }

    function similarity(a, b, options) {
      let left = a || "";
      let right = b || "";
      let insensitive = !(options || {}).sensitive;
      let longest = Math.max(left.length, right.length);
      return (
        (longest === 0
          ? 1
          : (longest - levenshtein(left, right, insensitive)) / longest) * 100
      ).toFixed(1);
    }
    let data = [];
    let isArray = array.constructor.name == "Array" ? array : [array] || [];
    isArray.map((v) =>
      data.push({
        string: v,
        accuracy: similarity(string, v),
      }),
    );
    return data;
  };

  toDate = (ms) => {
    let temp = ms;
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor(daysms / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor(hoursms / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor(minutesms / 1000);
    if (days == 0 && hours == 0 && minutes == 0) {
      return "Recently";
    } else {
      return days + "D " + hours + "H " + minutes + "M";
    }
  };

  timeFormat = (value) => {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - hours * 3600) / 60);
    let seconds = sec - hours * 3600 - minutes * 60;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    if (hours == parseInt("00")) return minutes + ":" + seconds;
    return hours + ":" + minutes + ":" + seconds;
  };

  switcher = (status, isTrue, isFalse) => {
    return status ? this.texted("bold", isTrue) : this.texted("bold", isFalse);
  };

  makeId = (length) => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  timeReverse = (duration) => {
    let milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
      days = Math.floor(duration / (24 * 60 * 60 * 1000));
    let hoursF = hours < 10 ? "0" + hours : hours;
    let minutesF = minutes < 10 ? "0" + minutes : minutes;
    let secondsF = seconds < 10 ? "0" + seconds : seconds;
    let daysF = days < 10 ? "0" + days : days;
    return daysF + "D " + hoursF + "H " + minutesF + "M";
  };

  greeting = () => {
    let time = moment.tz(process.env.TZ).format("HH");
    let res = `Don't forget to sleep`;
    if (time >= 3) res = `Good Evening`;
    if (time > 6) res = `Good Morning`;
    if (time >= 11) res = `Good Afternoon`;
    if (time >= 18) res = `Good Night`;
    return res;
  };

  jsonRandom = (file) => {
    let json = JSON.parse(fs.readFileSync(file));
    return json[Math.floor(Math.random() * json.length)];
  };

  filter = (text) => {
    if (text.length > 10) {
      return text.substr(text.length - 5);
    } else if (text.length > 7) {
      return text.substr(text.length - 4);
    } else if (text.length > 5) {
      return text.substr(text.length - 3);
    } else if (text.length > 2) {
      return text.substr(text.length - 2);
    } else if (text.length > 1) {
      return text.substr(text.length - 1);
    }
  };

  randomString = (len, charSet) => {
    charSet =
      charSet ||
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/+=*-%$();?!#@";
    let randomString = "";
    for (let i = 0; i < len; i++) {
      let randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  };

  removeEmojis = (string) => {
    let regex =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, "");
  };

  reSize = async (buffer, x, z) => {
    return new Promise(async (resolve, reject) => {
      let buff = await read(buffer);
      let ab = await buff.resize(x, z).getBufferAsync(MIME_JPEG);
      resolve(ab);
    });
  };

  Styles = (text, style = 1) => {
    const xStr = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ];
    const yStr = Object.freeze({
      1: [
        "ᴀ",
        "ʙ",
        "ᴄ",
        "ᴅ",
        "ᴇ",
        "ꜰ",
        "ɢ",
        "ʜ",
        "ɪ",
        "ᴊ",
        "ᴋ",
        "ʟ",
        "ᴍ",
        "ɴ",
        "ᴏ",
        "ᴘ",
        "q",
        "ʀ",
        "ꜱ",
        "ᴛ",
        "ᴜ",
        "ᴠ",
        "ᴡ",
        "x",
        "ʏ",
        "ᴢ",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      2: [
        "𝑎",
        "𝑏",
        "𝑐",
        "𝑑",
        "𝑒",
        "𝑓",
        "𝑔",
        "ℎ",
        "𝑖",
        "𝑗",
        "𝑘",
        "𝑙",
        "𝑚",
        "𝑛",
        "𝑜",
        "𝑝",
        "𝑞",
        "𝑟",
        "𝑠",
        "𝑡",
        "𝑢",
        "𝑣",
        "𝑤",
        "𝑥",
        "𝑦",
        "𝑧",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      3: [
        "𝐚",
        "𝐛",
        "𝐜",
        "𝐝",
        "𝐞",
        "𝐟",
        "𝐠",
        "𝐡",
        "𝐢",
        "𝐣",
        "𝐤",
        "𝐥",
        "𝐦",
        "𝐧",
        "𝐨",
        "𝐩",
        "𝐪",
        "𝐫",
        "𝐬",
        "𝐭",
        "𝐮",
        "𝐯",
        "𝐰",
        "𝐱",
        "𝐲",
        "𝐳",
        "𝟏",
        "𝟐",
        "𝟑",
        "𝟒",
        "𝟓",
        "𝟔",
        "𝟕",
        "𝟖",
        "𝟗",
        "𝟎",
      ],
      4: [
        "𝒂",
        "𝒃",
        "𝒄",
        "𝒅",
        "𝒆",
        "𝒇",
        "𝒈",
        "𝒉",
        "𝒊",
        "𝒋",
        "𝒌",
        "𝒍",
        "𝒎",
        "𝒏",
        "𝒐",
        "𝒑",
        "𝒒",
        "𝒓",
        "𝒔",
        "𝒕",
        "𝒖",
        "𝒗",
        "𝒘",
        "𝒙",
        "𝒚",
        "𝒛",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      5: [
        "𝗮",
        "𝗯",
        "𝗰",
        "𝗱",
        "𝗲",
        "𝗳",
        "𝗴",
        "𝗵",
        "𝗶",
        "𝗷",
        "𝗸",
        "𝗹",
        "𝗺",
        "𝗻",
        "𝗼",
        "𝗽",
        "𝗾",
        "𝗿",
        "𝘀",
        "𝘁",
        "𝘂",
        "𝘃",
        "𝘄",
        "𝘅",
        "𝘆",
        "𝘇",
        "𝟭",
        "𝟮",
        "𝟯",
        "𝟰",
        "𝟱",
        "𝟲",
        "𝟳",
        "𝟴",
        "𝟵",
        "𝟬",
      ],
      6: [
        "ᵃ",
        "ᵇ",
        "ᶜ",
        "ᵈ",
        "ᵉ",
        "ᶠ",
        "ᵍ",
        "ʰ",
        "ⁱ",
        "ʲ",
        "ᵏ",
        "ˡ",
        "ᵐ",
        "ⁿ",
        "ᵒ",
        "ᵖ",
        "ᵠ",
        "ʳ",
        "ˢ",
        "ᵗ",
        "ᵘ",
        "ᵛ",
        "ʷ",
        "ˣ",
        "ʸ",
        "ᶻ",
        "¹",
        "²",
        "³",
        "⁴",
        "⁵",
        "⁶",
        "⁷",
        "⁸",
        "⁹",
        "⁰",
      ],
      7: [
        "ᗩ",
        "ᗷ",
        "ᑕ",
        "ᗪ",
        "ᗴ",
        "ᖴ",
        "ᘜ",
        "ᕼ",
        "I",
        "ᒍ",
        "K",
        "ᒪ",
        "ᗰ",
        "ᑎ",
        "O",
        "ᑭ",
        "ᑫ",
        "ᖇ",
        "Տ",
        "T",
        "ᑌ",
        "ᐯ",
        "ᗯ",
        "᙭",
        "Y",
        "ᘔ",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      8: [
        "𝙖",
        "𝙗",
        "𝙘",
        "𝙙",
        "𝙚",
        "𝙛",
        "𝙜",
        "𝙝",
        "𝙞",
        "𝙟",
        "𝙠",
        "𝙡",
        "𝙢",
        "𝙣",
        "𝙤",
        "𝙥",
        "𝙦",
        "𝙧",
        "𝙨",
        "𝙩",
        "𝙪",
        "𝙫",
        "𝙬",
        "𝙭",
        "𝙮",
        "𝙯",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      9: [
        "𝘢",
        "𝘣",
        "𝘤",
        "𝘥",
        "𝘦",
        "𝘧",
        "𝘨",
        "𝘩",
        "𝘪",
        "𝘫",
        "𝘬",
        "𝘭",
        "𝘮",
        "𝘯",
        "𝘰",
        "𝘱",
        "𝘲",
        "𝘳",
        "𝘴",
        "𝘵",
        "𝘶",
        "𝘷",
        "𝘸",
        "𝘹",
        "𝘺",
        "𝘻",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      10: [
        "𝖺",
        "𝖻",
        "𝖼",
        "𝖽",
        "𝖾",
        "𝖿",
        "𝗀",
        "𝗁",
        "𝗂",
        "𝗃",
        "𝗄",
        "𝗅",
        "𝗆",
        "𝗇",
        "𝗈",
        "𝗉",
        "𝗊",
        "𝗋",
        "𝗌",
        "𝗍",
        "𝗎",
        "𝗏",
        "𝗐",
        "𝗑",
        "𝗒",
        "𝗓",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      11: [
        "Ⓐ︎",
        "Ⓑ",
        "︎Ⓒ",
        "︎Ⓓ︎",
        "Ⓔ︎",
        "Ⓕ︎",
        "Ⓖ︎",
        "Ⓗ︎",
        "Ⓘ︎",
        "Ⓙ︎",
        "Ⓚ︎",
        "Ⓛ︎",
        "Ⓜ︎",
        "Ⓝ︎",
        "Ⓞ︎",
        "Ⓟ",
        "︎Ⓠ︎",
        "Ⓡ︎",
        "Ⓢ",
        "︎Ⓣ︎",
        "Ⓤ︎",
        "Ⓥ︎",
        "Ⓦ︎",
        "Ⓧ︎",
        "Ⓨ︎",
        "Ⓩ︎",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      12: [
        "🅐︎",
        "🅑︎",
        "🅒",
        "︎🅓︎",
        "🅔︎",
        "🅕︎",
        "🅖︎",
        "🅗",
        "︎🅘︎",
        "🅙︎",
        "🅚",
        "︎🅛︎",
        "🅜",
        "︎🅝︎",
        "🅞",
        "︎🅟",
        "︎🅠︎",
        "🅡︎",
        "🅢",
        "︎🅣",
        "︎🅤",
        "︎🅥︎",
        "🅦︎",
        "🅧︎",
        "🅨︎",
        "🅩︎",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      13: [
        "卂",
        "乃",
        "匚",
        "ᗪ",
        "乇",
        "千",
        "ᘜ",
        "卄",
        "|",
        "ﾌ",
        "Ҝ",
        "ㄥ",
        "爪",
        "几",
        "ㄖ",
        "卩",
        "Ҩ",
        "尺",
        "丂",
        "ㄒ",
        "ㄩ",
        "ᐯ",
        "山",
        "乂",
        "ㄚ",
        "乙",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      14: [
        "ⓐ",
        "ⓑ",
        "ⓒ",
        "ⓓ",
        "ⓔ",
        "ⓕ",
        "ⓖ",
        "ⓗ",
        "ⓘ",
        "ⓙ",
        "ⓚ",
        "ⓛ",
        "ⓜ",
        "ⓝ",
        "ⓞ",
        "ⓟ",
        "ⓠ",
        "ⓡ",
        "ⓢ",
        "ⓣ",
        "ⓤ",
        "ⓥ",
        "ⓦ",
        "ⓧ",
        "ⓨ",
        "ⓩ",
        "①",
        "②",
        "③",
        "④",
        "⑤",
        "⑥",
        "⑦",
        "⑧",
        "⑨",
        "⓪",
      ],
      15: [
        "𝚊",
        "𝚋",
        "𝚌",
        "𝚍",
        "𝚎",
        "𝚏",
        "𝚐",
        "𝚑",
        "𝚒",
        "𝚓",
        "𝚔",
        "𝚕",
        "𝚖",
        "𝚗",
        "𝚘",
        "𝚙",
        "𝚚",
        "𝚛",
        "𝚜",
        "𝚝",
        "𝚞",
        "𝚟",
        "𝚠",
        "𝚡",
        "𝚢",
        "𝚣",
        "𝟷",
        "𝟸",
        "𝟹",
        "𝟺",
        "𝟻",
        "𝟼",
        "𝟽",
        "𝟾",
        "𝟿",
        "𝟶",
      ],
      16: [
        "a͢",
        "b͢",
        "c͢",
        "d͢",
        "e͢",
        "f͢",
        "g͢",
        "h͢",
        "i͢",
        "j͢",
        "k͢",
        "l͢",
        "m͢",
        "n͢",
        "o͢",
        "p͢",
        "q",
        "͢r",
        "͢s͢",
        "t",
        "͢u",
        "͢v͢",
        "w͢",
        "x͢",
        "y",
        "͢z",
        "͢1͢",
        "2͢",
        "3",
        "͢4͢",
        "5͢",
        "6͢",
        "7͢",
        "8͢",
        "9͢",
        "0͢",
      ],
      17: [
        "𝕒",
        "𝕓",
        "𝕔",
        "𝕕",
        "𝕖",
        "𝕗",
        "𝕘",
        "𝕙",
        "𝕚",
        "𝕛",
        "𝕜",
        "𝕝",
        "𝕞",
        "𝕟",
        "𝕠",
        "𝕡",
        "𝕢",
        "𝕣",
        "𝕤",
        "𝕥",
        "𝕦",
        "𝕧",
        "𝕨",
        "𝕩",
        "𝕪",
        "𝕫",
        "𝟙",
        "𝟚",
        "𝟛",
        "𝟜",
        "𝟝",
        "𝟞",
        "𝟟",
        "𝟠",
        "𝟡",
        "𝟘",
      ],
      18: [
        "【a】",
        "【b】",
        "【c】",
        "【d】",
        "【e】",
        "【f】",
        "【g】",
        "【h】",
        "【i】",
        "【j】",
        "【k】",
        "【l】",
        "【m】",
        "【n】",
        "【o】",
        "【p】",
        "【q】",
        "【r】",
        "【s】",
        "【t】",
        "【u】",
        "【v】",
        "【w】",
        "【x】",
        "【y】",
        "【z】",
        "【1】",
        "【2】",
        "【3】",
        "【4】",
        "【5】",
        "【6】",
        "【7】",
        "【8】",
        "【9】",
        "【0】",
      ],
      19: [
        "ａ",
        "ｂ",
        "ｃ",
        "ｄ",
        "ｅ",
        "ｆ",
        "ｇ",
        "ｈ",
        "ｉ",
        "ｊ",
        "ｋ",
        "ｌ",
        "ｍ",
        "ｎ",
        "ｏ",
        "ｐ",
        "ｑ",
        "ｒ",
        "ｓ",
        "ｔ",
        "ｕ",
        "ｖ",
        "ｗ",
        "ｘ",
        "ｙ",
        "ｚ",
        "１",
        "２",
        "３",
        "４",
        "５",
        "６",
        "７",
        "８",
        "９",
        "０",
      ],
      20: [
        "『a』",
        "『b』",
        "『c』",
        "『d』",
        "『e』",
        "『f』",
        "『g』",
        "『h』",
        "『i』",
        "『j』",
        "『k』",
        "『l』",
        "『m』",
        "『n』",
        "『o』",
        "『p』",
        "『q』",
        "『r』",
        "『s』",
        "『t』",
        "『u』",
        "『v』",
        "『w』",
        "『x』",
        "『y』",
        "『z』",
        "『1』",
        "『2』",
        "『3』",
        "『4』",
        "『5』",
        "『6』",
        "『7』",
        "『8』",
        "『9』",
        "『0』",
      ],
    });
    const replacer = [];
    xStr.map((v, i) =>
      replacer.push({
        original: v,
        convert: yStr[style][i],
      }),
    );
    const str = text.toLowerCase().split("");
    const output = [];
    str.map((v) => {
      const find = replacer.find((x) => x.original == v);
      find ? output.push(find.convert) : output.push(v);
    });
    return output.join("");
  };

  formatmoney = (angka) => {
    let suffixes = ["", " K", " M", " B", " T", " Q"];
    let suffixIndex = Math.floor(Math.log10(angka) / 3);
    let suffix = suffixes[suffixIndex];
    let scaledmoney = angka / Math.pow(10, suffixIndex * 3);
    return scaledmoney.toFixed(2) + suffix;
  };
};
