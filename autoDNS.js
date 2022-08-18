#如上第 1、2 行的 SSID1、SSID2 部分請自行新增或者刪減、修改，如有增加或減少請再修改第 4 行的部份即可
#第 3 行的 NextDNS 名稱需要跟DoH模組的第一行名稱對應
const ssid1 = "Gmz-5g";
const ssid2 = "SSID2";
const name = "DH-DNS";
let home = ($network.wifi.ssid === ssid1) || ($network.wifi.ssid === ssid2);

const getModuleStatus = new Promise((resolve) => {
  $httpAPI("GET", "v1/modules", null, (data) =>
	  resolve(data.enabled.includes(name))
  );
});

getModuleStatus.then((enabled) => {
  if (home && enabled) {
    //在家，卻啟用模組 => 關閉
	$notification.post(`關閉 ${name} 模組`, "" ,"");
	enableModule(false);
  } else if (!home && !enabled) {
	//不在家，沒啟用模組 => 啟用
	$notification.post(`啟用 ${name} 模組`, "" ,"");
	enableModule(true);
  } else {
	//其他情況 => 重複觸發 => 結束腳本
	//$notification.post("重複觸發", "", "");
	$done();
  }
});

function enableModule(status) {
  $httpAPI("POST", "v1/modules", { [name]: status }, () => $done());
}
