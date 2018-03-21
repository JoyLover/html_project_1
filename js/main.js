var xmlhttp;
var companies; //所有公司对象的数组
var temp = new Array();  //当前符合查询条件的公司对象的数组

/**
 * 判断输入的公司名是否符合要求
 * @param {String} [CompanyName] [输入的条件：公司名]
 * @return {Number} [返回1，若CompanyName为空或符合要求；返回0，若CompanyName不符合要求]
 */
function ComNamePassOrNot(CompanyName)
{
	if(CompanyName=="")return 1;

	var reg = /^[0-9a-zA-Z]+$/   //大小写字母和数字
	if(!reg.test(CompanyName))
	{
		//输出错误信息
		document.getElementById("ComNameErr").innerHTML = "只能填写大小写字母和数字";
		return 0;
	}
	if(CompanyName.length > 15)
	{
		//输出错误信息
		document.getElementById("ComNameErr").innerHTML = "不可以超过15个字符";
		return 0;
	}
	return 1;
}

/**
 * 判断输入的创办年是否符合要求
 * @param {String} [FoundedYear] [输入的条件：创办年份]
 * @return {Number} [返回1，若FoundedYear为空或符合要求；返回0，若FoundedYear不符合要求]
 */
function FdedYearPassOrNot(FoundedYear)
{
	if(FoundedYear=="")return 1;
	var reg = /^[0-9]+$/  //仅数字
	var date = new Date();
	if(!reg.test(FoundedYear) || FoundedYear.length!=4 || FoundedYear < "1970" || FoundedYear > date.getFullYear())
	{
		//输出错误信息
		document.getElementById("YearErr").innerHTML = "只能填写合理四位数字年份，1970年至今";
		return 0;
	}
	return 1;	
}

/**
 * 判断输入的创始人是否符合要求
 * @param {String} [FounderName] [输入的条件：创始人]
 * @return {Number} [返回1，若FounderName为空或符合要求；返回0，若FounderName不符合要求]
 */
function FderNamePassOrNot(FounderName)
{
	if(FounderName=="")return 1;
	var reg = /^[a-zA-Z]+$/  //仅大小写字母
	if(!reg.test(FounderName) || FounderName.length > 15)
	{
		//输出错误信息
		document.getElementById("FNameErr").innerHTML = "只能填写大小写字母，不可以超过15个字符";
		return 0;
	}
	return 1;	
}

/**
 * 初始化表格title
 * @return {Null}
 */
function titleInitialize()
{
	document.getElementById("results").innerHTML = '<tr id="title"><th>Logo</th><th>Company Name</th>'+
													'<th>Official Website</th>'+
													'<th>Founded Date</th>'+
													'<th>Founder(s)</th>'+
													'<th>Descriptions</th></tr>';
	return;
}

/**
 * 从temp尾部添加符号条件的公司对象
 * @param  {object} [item] [公司对象，包含了各属性]
 * @return {Null}
 */
function compAppend(item)
{
	temp.push(item);
}

/**
 * sort的辅助函数
 * @param  {undefined} [a] [前一个比较元素]
 * @param  {undefined} [b] [后一个比较元素]
 * @return {Boolean} [a>b则返回真，反之返回假]
 */
function sortName(a, b)
{
	return a.name > b.name;
}

/**
 * 对满足查询条件的公司对象按公司名字母从小到大的顺序重新排列
 * @return {Null}
 */
function sortCompanyByName()
{
	temp.sort(sortName);
}

/**
 * 对满足查询条件的公司对象数组temp中的元素一一输出至html表格中
 * @return {Null}
 */
function printCompany()
{
	sortCompanyByName(); //首先对temp进行按字母顺序排序

	//temp中元素一一添加到表格中
	for(var i=0, len=temp.length; i<len; i++)
	{
		var item = temp[i];

		//创建tr, 6个td元素
		var tr = document.createElement("tr");
		var td1 = document.createElement("td");
		var td2 = document.createElement("td");
		var td3 = document.createElement("td");
		var td4 = document.createElement("td");
		var td5 = document.createElement("td");
		var td6 = document.createElement("td");

		//元素中添加内容
		td1.innerHTML = '<a target="_blank" href="'+item.website+'">'+'<img src="images/logo_'+item.name+'.png" id="imgs"/></a>';
		td2.innerHTML = item.name;
		td3.innerHTML = '<a target="_blank" href="'+item.website+'">'+item.website.substring(item.website.indexOf("w"));
		td4.innerHTML = item.founded_date.substring(0,4)+'.'+item.founded_date.substring(4,6)+'.'+item.founded_date.substring(6);
		td5.innerHTML = "";

		var lenF = item.founders.length;
		for(var j=0; j<lenF-1; j++)
		{
			td5.innerHTML += item.founders[j].first_name + ' ' + item.founders[j].last_name + ', ';
		}
		td5.innerHTML += item.founders[lenF-1].first_name + ' ' + item.founders[lenF-1].last_name;
		
		td6.innerHTML = item.description;

		//向表格根元素中添加孩子元素
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		tr.appendChild(td5);
		tr.appendChild(td6);
		document.getElementById("results").appendChild(tr);
	}
}

/**
 * 进行条件比对，取出符合条件的公司对象
 * @param {String} [CompanyName] [输入的条件：公司名]
 * @param {String} [FoundedYear] [输入的条件：创办年份]
 * @param {String} [FounderName] [输入的条件：创始人]
 * @return {Null}
 */
function getResults(CompanyName, FoundedYear, FounderName)
{
	//无条件查询则输出所有公司信息
	if(CompanyName=="" && FoundedYear=="" && FounderName=="")
	{
		for(j = 0, len = companies.length; j < len; j++)
			compAppend(companies[j]);
		printCompany();
		return;
	}
	
	//有条件查询
	for(var j = 0, len1 = companies.length; j < len1; j++)
	{
		//条件一查询
		if(CompanyName!="" && companies[j].name.toLowerCase().match(CompanyName.toLowerCase()))
		{
			compAppend(companies[j]);
			continue;
		}
		//条件二查询
		if(FoundedYear!="" && companies[j].founded_date.match(FoundedYear))
		{
			compAppend(companies[j]);
			continue;
		}
		//条件三查询
		for(var k = 0, len2 = companies[j].founders.length; FounderName != "" && k < len2; k++)
		{
			var fn = companies[j].founders[k].first_name+" "+companies[j].founders[k].last_name;
			if(fn.toLowerCase().match(FounderName.toLowerCase()))
			{
				compAppend(companies[j]);
				break;
			}
		}
	}

	//打印公司对象数组至表格
	printCompany();
	return;
}

/**
 * AJAX异步方式GET JSON文件
 * @param  {String} [url] [‘GET'方式访问文件]
 * @param {String} [CompanyName] [输入的条件：公司名]
 * @param {String} [FoundedYear] [输入的条件：创办年份]
 * @param {String} [FounderName] [输入的条件：创始人]
 * @return {Null}
 */
function loadXMLDoc(url, CompanyName, FoundedYear, FounderName)
{
	if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
    	xmlhttp = new XMLHttpRequest();
    }
	else
  	{// code for IE6, IE5
  		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  	}
  	//异步监听
	xmlhttp.onreadystatechange = function(){
		    if (xmlhttp.readyState==4 && xmlhttp.status==200)
	        {
	        	companies = JSON.parse(xmlhttp.responseText);
	        	getResults(CompanyName, FoundedYear, FounderName);
	        	document.getElementById("results").style.visibility = "visible";
	        }
	    }
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}

/**
 * onclick触发事件，查询JSON文件，并以表格形式呈现
 */
function SearchJson()
{
	document.getElementById("results").innerHTML = "";
	document.getElementById("results").style.visibility = "hidden";
	//获取用户输入的三个文本框的信息
	var CompanyName = document.getElementById("CompanyName").value;
	var FoundedYear = document.getElementById("FoundedYear").value;
	var FounderName = document.getElementById("FounderName").value;

	//先清空错误信息
	document.getElementById("ComNameErr").innerHTML = "";
	document.getElementById("YearErr").innerHTML = "";
	document.getElementById("FNameErr").innerHTML = "";

	//判断是否符合搜索标准，若不符合则显示原因
	var ComNamePass = ComNamePassOrNot(CompanyName);
	var FdedYearPass = FdedYearPassOrNot(FoundedYear);
	var FderNamePass = FderNamePassOrNot(FounderName);

	//若条件符合标准，则进行查找
	if (ComNamePass && FdedYearPass && FderNamePass) 
	{
		titleInitialize(); //表格title初始化
		loadXMLDoc("application/companies.json", CompanyName, FoundedYear, FounderName);
		temp = new Array();		
	}
	else return;
}

/**
 * onclick触发事件，清空所有多余信息，回到页面出事状态
 */
function Clear()
{
	//清空错误信息
	document.getElementById("ComNameErr").innerHTML = "";
	document.getElementById("YearErr").innerHTML = "";
	document.getElementById("FNameErr").innerHTML = "";

	//清空条件
	document.getElementById("CompanyName").value = "";
	document.getElementById("FoundedYear").value = "";
	document.getElementById("FounderName").value = "";

	//清空查询的结果表格
	document.getElementById("results").style.visibility = "hidden";
	document.getElementById("results").innerHTML = "";
}
