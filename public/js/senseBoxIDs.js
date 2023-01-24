const senseBoxIds = [
  {
    name: "SUGUCS1",
    senseBoxID: "638b1a8f11467c001b6b1af3",
    token: "b7689efea66f03c9aaa543c5f11d9db110c4e567150c04789c24fd8774ece526",
  },
  {
    name: "SUGUCS2",
    senseBoxID: "638b1b2f11467c001b6b6d58",
    token: "ced39da6865a4c47d4fcb2c40bf3eca8c9132ab90a0081873a74698597865506",
  },
  {
    name: "SUGUCS3",
    senseBoxID: "638b1bf111467c001b6bd14f",
    token: "1214441391707782eb9c5763cba475499341bf545c35b290fb14c84ac232983b",
  },
  {
    name: "SUGUCS4",
    senseBoxID: "638b1c4811467c001b6bfcb5",
    token: "8a044fc73296733be1304c89eebc2be8f9959f6c627734d69feecc9a691b4311",
  },
  {
    name: "SUGUCS5",
    senseBoxID: "638b1c9011467c001b6c1eb6",
    token: "48bbff7b26e77ea44e398b23918819a975af34f9836e4d9da65e1476923a94a6",
  },
  {
    name: "SUGUCS6",
    senseBoxID: "638b1cc911467c001b6c3727",
    token: "c2c85006345b39b0b501a3254a964a983e4eb8f332ff2273cd0fa8dceb2c05e7",
  },
  {
    name: "SUGUCS7",
    senseBoxID: "638b1d1911467c001b6c68c0",
    token: "43ad71b1bc192e53d6e302c13aee570d0d3ce39a1931147bd017f6bccace3c33",
  },
  {
    name: "SUGUCS8",
    senseBoxID: "638b1d5b11467c001b6c844d",
    token: "b3961b4ca50f6d151ca42845340bc9dabddc37e7923daab91839523e88d6e021",
  },
  {
    name: "SUGUCS9",
    senseBoxID: "638b1dae11467c001b6cb1e5",
    token: "20de66dac82b6d611a0b25d75adf8070322ee1d6df4f96d1d5c4be700117d67f",
  },
  {
    name: "SUGUCS10",
    senseBoxID: "638b1dfc11467c001b6cd64f",
    token: "e9a7b0c1e84d6f725ae1d75a0b8733d85a65345b87488d68f073994f31e45734",
  },
  {
    name: "SUGUCS11",
    senseBoxID: "638b1e3611467c001b6cf567",
    token: "2bc7426c70363cf917b977a27d97b1668b694f99ab717f8ea6abda5b14729940",
  },
  {
    name: "SUGUCS12",
    senseBoxID: "638b1e6f11467c001b6d12dc",
    token: "095e217ddfc5ec822f341d0e635239357067097a97e6ca48866361c9f7b74a63",
  },
  {
    name: "SUGUCS13",
    senseBoxID: "638b1ea611467c001b6d30b6",
    token: "b512d11617a640a7d5c8216641640295f8263fb9e8a5f8a7c039f95256d4783e",
  },
  {
    name: "SUGUCS14",
    senseBoxID: "638b1eda11467c001b6d4b03",
    token: "bace5ded71c4b6792b19336fdabf18db2a40a82fefd7b0f2d2954e6845a71520",
  },
  {
    name: "SUGUCS15",
    senseBoxID: "638b1f2b11467c001b6d72df",
    token: "0f2f13b7d05a7fa3176fab13d217a98c2f4d7a45b68d00c1c32832d48dd5e95e",
  },
  {
    name: "SUGUCS16",
    senseBoxID: "638b1f6411467c001b6d9188",
    token: "8b7c469626c84abdc795dec23786c3be4c9e12713d484a3bd68c93a5d25d7ba6",
  },
  {
    name: "SUGUCS17",
    senseBoxID: "638b1fa411467c001b6db193",
    token: "a6b7d4e152ea68807e2c5b1330827ea2856bdbc7d03f260f21b54c270477bada",
  },
  {
    name: "SUGUCS18",
    senseBoxID: "638b1ff911467c001b6dde5f",
    token: "050eb6a8c95766134bedc3690d1e1d02629417021cac987a3b5bbbdef73238cc",
  },
  {
    name: "SUGUCS19",
    senseBoxID: "638b203c11467c001b6dfc1f",
    token: "b017dad6434a7b9e5740daf9a7edc007f666395d0d5802337bb32508ef8da2cb",
  },
  {
    name: "SUGUCS20",
    senseBoxID: "638b206f11467c001b6e1b12",
    token: "baab76df424db71b1b7a5080946c76b3b96e91fff5411e1dd11672a40d3dd70a",
  },
  {
    name: "SUGUCS21",
    senseBoxID: "638b20ac11467c001b6e38d0",
    token: "944d5046889608df73707e39435d72c1d07952d423cea4270ea32fd267df31f7",
  },
  {
    name: "SUGUCS22",
    senseBoxID: "638b20dd11467c001b6e5137",
    token: "0c8fe73f1b680d8078faac6b2b44ca26d93e7898da95e3615e1c4dab5e10aaae",
  },
];

// Füllen des Bereichs mit den IDs
const idDiv = document.getElementById("infoIDs");

let inner = "";
senseBoxIds.forEach((item) => {
  inner += "<b>" + item.name + "</b><br>";
  inner += "<b>SenseBox ID: </b><br>";
  inner +=
    "<input id='" +
    item.senseBoxID +
    "Input' value='" +
    item.senseBoxID +
    "' type='text' readonly='true'>";
  inner +=
    "<span class='copyButton input-group-addon btn' id='" +
    item.senseBoxID +
    "' title='In die Zwischenablage kopieren' onclick='kopieren(this)'>";
  inner += "<img src='images/copy.svg' style='height:25px'>";
  inner += "</span><br>";
  inner += "<b> Access Token: </b>" + item.token + "<p></p>";
});

idDiv.innerHTML = inner;
