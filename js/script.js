
		var ServiceKey = "7eD5be%2Fby%2FPLL5EeqoTnJ8j3G%2FZQMxo5gzGl5h0r63ed2YgArMVYY%2BBi0Na4LYHcDCXhULdEO2%2F8vFInRJT3Mw%3D%3D";
		var params = '?' + encodeURIComponent('ServiceKey') + '=' + ServiceKey; /*Service Key*/
		params += '&' + encodeURIComponent('ServiceKey') + '=' + encodeURIComponent(ServiceKey);
		params += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /*한 페이지 결과 수*/
		params += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /*현재 페이지 번호*/
		params += '&' + encodeURIComponent('MobileOS') + '=' + encodeURIComponent('ETC'); /*IOS(아이폰),AND(안드로이드),WIN(원도우폰),ETC*/
		params += '&' + encodeURIComponent('MobileApp') + '=' + encodeURIComponent('AppTest'); /*서비스명=어플명*/
		params += '&' + encodeURIComponent('defaultYN') + '=' + encodeURIComponent('Y'); /*기본정보 조회여부*/
		params += '&' + encodeURIComponent('firstImageYN') + '=' + encodeURIComponent('Y'); /*원본, 썸네일 대표이미지 조회여부*/
		params += '&' + encodeURIComponent('areacodeYN') + '=' + encodeURIComponent('Y'); /*지역코드, 시군구코드 조회여부*/
		params += '&' + encodeURIComponent('catcodeYN') + '=' + encodeURIComponent('Y'); /*대,중,소분류코드 조회여부*/
		params += '&' + encodeURIComponent('addrinfoYN') + '=' + encodeURIComponent('Y'); /*주소, 상세주소 조회여부*/
		params += '&' + encodeURIComponent('mapinfoYN') + '=' + encodeURIComponent('Y'); /*좌표 X,Y 조회여부*/
		params += '&' + encodeURIComponent('overviewYN') + '=' + encodeURIComponent('Y'); /*콘텐츠 개요 조회여부*/
		//params += '&' + encodeURIComponent('contentId') + '=' + encodeURIComponent(''); /*콘텐츠ID*/
		//params += '&' + encodeURIComponent('contentTypeId') + '=' + encodeURIComponent(''); /*관광타입(관광지, 숙박 등) ID*/

		//지역 선택
		function getAreaCode(code) {
			var code = code ? code : "";
			var codeappend = code ? $("#sigunguCode") : $("#areaCode");
			var url = 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaCode';
			url += params 
			url += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(code);
			console.log(url);
			$.get(url, function (res) {
				console.log(res);
				var items = $(res).find("item");
				for (var i = 0; i < items.length; i++) {
					var codeItem = $(items[i]).find("code");
					var code = codeItem.text();
					var nameItem = $(items[i]).find("name");
					var name = nameItem.text();
					var opt = "<option value='" + code + "'>" + name + "</option>";
					codeappend.append(opt);
				}
			});
		}

		getAreaCode();

		var areaCode;
		$("#areaCode").on("change", function () {
			areaCode = $(this).val();
			$("#sigunguCode option").remove();
			$("#sigunguCode").append("<option value=''>시군구선택</option>");
			getAreaCode(areaCode);
			getInfoList(areaCode);
		});

 		$("#sigunguCode").on("change", function () {
			var sigunguCode = $(this).val();
			getInfoList(areaCode, sigunguCode);	
 		});

		function getInfoList(areaCode, sigunguCode) {
			var areaCode = areaCode ? areaCode : "";
			var sigunguCode = sigunguCode ? sigunguCode : "";
			var url = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/areaBasedList";
			url += params;
			url += '&' + encodeURIComponent('areaCode') + '=' + encodeURIComponent(areaCode); //지역코드
			url += '&' + encodeURIComponent('sigunguCode') + '=' + encodeURIComponent(sigunguCode); //시군구 코드
			url += '&' + encodeURIComponent('listYN') + '=' + encodeURIComponent('Y'); //목록 구분
			url += '&' + encodeURIComponent('arrange') + '=' + encodeURIComponent('A'); //정력(A=제목순,B=조회순,C=수정일순,D=생성일순)
			$(".list table tbody").html("");
			$.get(url, function (res) {
				var items = $(res).find("item");
				for (var i = 0; i < items.length; i++) {
					console.log(items[i]);
					var title = $(items[i]).find("title").text();
					var addr = $(items[i]).find("addr1").text() + " " + $(items[i]).find("addr2").text();
					var tel = $(items[i]).find("tel").text();
					var mapx = $(items[i]).find("mapx").text();
					var mapy = $(items[i]).find("mapy").text();
					var firstimage = $(items[i]).find("firstimage").text();
					var firstimage2 = $(items[i]).find("firstimage2").text();
					var contentid = $(items[i]).find("contentid").text();
					var tr = "<tr onclick='viewDetail(\"" + contentid + "\");'>";
					tr += "<td><img src='" + firstimage + "' width='250' height='150'></td>";
					tr += "<td>" + title + "</td>";
					tr += "<td>" + addr + "</td>";
					tr += "</tr>";
					$(".list table tbody").append(tr);
				}
			});
		}

		/* 팝업창 속성 */
		function viewDetail(contentid) {
			var contentid = contentid ? contentid : "";
			if (!contentid) return;
			var url = "http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon";
			url += params;
			url += '&' + encodeURIComponent('contentId') + '=' + encodeURIComponent(contentid); //콘텐츠아이디
			alert(url);
			$.get(url, function (res) {
				$(".detail-info").html("");
				$(".detail-img").attr("src", "");
				var items = $(res).find("item");
				var data = items[0];
				console.log(data);
				var title = $(data).find("title").text();
				var addr = $(data).find("zipcode").text() + ") " + $(data).find("addr1").text() + " " + $(data).find("addr2").text();
				var tel = $(data).find("tel").text();
				var telx = "없음";
				var mapx = $(data).find("mapx").text();
				var mapy = $(data).find("mapy").text();
				var overview = $(data).find("overview").text();
				var firstimage = $(data).find("firstimage").text();
				$("#detail-title").html(title);
				$("#detail-addr").html(addr);
				$("#detail-tel").html(tel);
				$("#detail-map").html(mapy + "," + mapx);
				$("#detail-overview").html(overview);
				$("#detail-pic").attr("src", firstimage);
				$("#pop").dialog({
					width: 600,
					height: 700,
					modal: true,
					title: title
				});
			});

			$("#detail-btn").on("click", function () {
			var url = "https://www.google.com/maps/search/";
			var xy = $(this).text();
			var title = $("#detail-title").text();
			url += title + "/@" + xy + "z/";
			window.open(url);
		});
		}

$(document).ready(function () {
  $("#search").keyup(function () {
    $(".tbody tr").hide();

    var k = $(this).val();
    var kup = k.toUpperCase();
    var klo = k.toLowerCase();

    $(".tbody tr").filter(function () {
      $(this).toggle( $(this).text().indexOf(k) > -1 );
      $(this).toggle( $(this).text().toUpperCase().indexOf(kup) > -1 );
      $(this).toggle( $(this).text().toLowerCase().indexOf(klo) > -1 );
    });

  });
});