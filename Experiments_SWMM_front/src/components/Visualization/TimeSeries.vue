<style scoped>
.btnHoverBlue:hover {
  background-color: #2db7f5;
  color: white;
}
.btnHoverGreen:hover {
  background-color: #19be6b;
  color: white;
}
.submitTitle{
    margin-top: 5px;
    margin-left: 5px;
    display: inline-block;
    word-break: break-word;
    width: 60px;
    font-size: 1px;
    position: absolute;
    line-height: 1.2;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
<template>
    <div>
        <Card dis-hover style="height:100%" id="summaryCard">
            <div slot="title">
                <h3>
                    <Icon type="md-pulse" />
                    Graph - TimeSeries
                </h3>
            </div>
            <div slot="extra">
                <div style="margin-top:-10px">
                    <div style="display:inline-block;margin: 5px 0 0 -60px;position: absolute;">
                        <h5 style="display:inline-block">You:</h5>
                        <avatar
                            :username="pageParams.userName"
                            :size="25"
                            :title="pageParams.userName"
                            style="display:inline-block;margin:0 2px"
                        ></avatar>
                    </div>
                    <h5 style="margin-top:8px;margin-left:5px;display: inline-block;position:absolute">
                        Participants:
                    </h5>
                    <div style="margin-left:80px;padding:1px 5px;margin-top:5px;display:inline-block;height:100%;width:200px;white-space: nowrap">
                        <vue-scroll :ops="ops">
                            <avatar
                                v-for="participant in participants"
                                :key="participant.index"
                                :username="participant.userName"
                                :size="25"
                                :title="participant.userName"
                                style="display:inline-block;margin:0 2px"
                            ></avatar>
                        </vue-scroll>
                    </div>
                    <p class="submitTitle">
                        Submit
                        operation
                    </p>
                    <h5 style="display: inline-block;margin:8px 0 0 60px;position:absolute">:</h5>
                    <Button icon="ios-paper-plane" 
                    shape="circle" class="btnHoverGreen" 
                    style="margin:-18px 0 0 70px" @click="submitOp"></Button>
                </div>
            </div>
            <div>
                <span>Object Type:</span>
                <Select v-model="selectType" size="small" style="width:130px" :disabled="!originalData" @on-change="selectedTypeChange">
                    <Option v-for="item in typeList" :value="item" :key="item.index">{{ item }}</Option>
                </Select>
                <span>Object Name:</span>
                <Select v-model="selectName" size="small" style="width:150px" :disabled="!originalData" filterable>
                    <Option v-for="item in objNameList" :value="item" :key="item.index">{{ item }}</Option>
                </Select>
                <span>Variable:</span>
                <Select v-model="selectVariable" size="small" style="width:120px" :disabled="!originalData">
                    <Option v-for="item in variableList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span>Rain Gage:</span>
                <Select v-model="selectRaingage" size="small" style="width:120px" :disabled="!originalData">
                    <Option v-for="item in rainageList" :value="item" :key="item">{{ item }}</Option>
                </Select>
                <div style="float:right">
                <Button @click="loadInpShow" size="small" class="btnHoverBlue">Load Inp</Button>
                <Button @click="loadRptShow" size="small" class="btnHoverBlue">Load Rpt</Button>
                    <Button @click="showTimeSeries" size="small" class="btnHoverGreen" :disabled="!originalData">Visualization</Button>
                </div>
            </div>
            <div style="border: 1px solid #dcdee2;margin-top:5px;height:calc(100vh - 120px)" id="chartContent">
                <div v-if="!originalData" style="text-align:center">
                    <div style="color:lightgray;font-size:4em; font-weight:bold">
                        Please load original files, firstly.
                    </div>
                </div>
                <div v-else-if="!visualization" style="text-align:center">
                    <div style="color:lightgray;font-size:4em; font-weight:bold">
                        Please select data to visualization.
                    </div>
                </div>
                <div v-show="originalData && visualization">
                    <Row>
                        <Col span="20">
                            <div id="output-visualization-echarts" style="height:calc(100vh - 120px);width:100%"></div>
                        </Col>
                        <Col span="4">
                            <div style="height:calc(100vh - 120px);padding:10px;border: 1px solid #dcdee2;" v-if="chartOption !='{}'">
                                <h1>Set the render</h1>
                                <div style="margin:10px 0">
                                    <span>Reporting(min):</span>
                                    <InputNumber size="small" v-model="recodeStep"  style="width:150px"/>
                                    <Button shape="circle" icon="md-refresh" class="btnHoverGreen" size="small" @click="resetRainLine"></Button>
                                </div>
                                <div style="margin:10px 0">
                                    <span>L-Y axis max:</span>
                                    <Input size="small" v-model="chartOption.yAxis[0].max" />
                                </div>
                                <div style="margin:10px 0">
                                    <span>L-Y axis label:</span>
                                    <Input size="small" v-model="chartOption.yAxis[0].name" />
                                </div>
                                <div style="margin:10px 0">
                                    <span>R-Y axis max:</span>
                                    <Input size="small" v-model="chartOption.yAxis[1].max" />
                                </div>
                                <div style="margin:10px 0">
                                    <span>Data Zoom:</span>
                                    <div>
                                        <InputNumber  size="small" v-model="chartOption.dataZoom[0].start" style="width:50px"/>
                                        %-
                                        <InputNumber  size="small" v-model="chartOption.dataZoom[0].end"  style="width:50px"/>
                                        %
                                    </div>
                                </div>
                                <div style="text-align: center;">
                                    <Button @click="reRenderChart" class="btnHoverBlue">Re-render</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Card>
        <Modal
        id="loadInp"
        v-model="loadInpModal"
        :styles="{top: '20px'}"
        width="500">
            <div slot="header">
                <h4 style="display:inline-block">Upload inp file</h4>
            </div>
            <div style="text-align: center;">
                <div>
                <span>Inp file:</span>
                <Input v-model="inpFileUrl" placeholder="inp file" style="width: 300px;margin:0 10px" />
                </div>
            </div>
            <div slot="footer">
                <Button @click="loadInp" style="margin: 0 15px;width: 200px;" size="small" type="primary" >Upload</Button>
            </div>
        </Modal>
        <Modal
        id="loadRpt"
        v-model="loadRptModal"
        :styles="{top: '20px'}"
        width="500">
            <div slot="header">
                <h4 style="display:inline-block">Upload rpt file</h4>
            </div>
            <div style="text-align: center;">
                <div>
                <span>Rpt file:</span>
                <Input v-model="rptFileUrl" placeholder="rpt file" style="width: 300px;margin:0 10px" />
                </div>
            </div>
            <div slot="footer">
                <Button @click="loadRpt" style="margin: 0 15px;width: 200px;" size="small" type="primary" >Upload</Button>
            </div>
        </Modal>
        <Spin fix v-if="spinShow">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script>
import Avatar from "vue-avatar";
export default {
    name: 'TimeSeries',
    components: {
        Avatar
    },
    created(){
        this.getPageInfo();
    },
    mounted(){
        this.connectSocket();
        this.selectedTypeChange("Node");
        window.onresize = ()=>{
            if(this.originalData && this.visualization){
                this.timeSeriesPlot.resize();
            }
        }
    },
    data(){
        return{
            pageParams:{},
            spinShow:false,
            timeSeriesPlot:null,
            inpData:false,
            rptData:false,
            loadInpModal:false,
            inpFileUrl:"LishuiEx",
            loadRptModal:false,
            rptFileUrl:"LishuiEx1",
            originalData:false,
            visualization:false,
            selectType:"Node",
            typeList:["Subcatchment", "Node", "Link"],
            selectName:"",
            objectNames:{
                        "Node":["Outfall1", "node1","node2"],
                        "Subcatchment":[],
                        "Link":[],
                        "RainGage":["rain"]
                    },
            objNameList:[],
            selectVariable:"",
            variableList:[],
            selectRaingage:"",
            rainageList:[],
            formatedData:{},
            chartOption : {
                title: {
                text: "",
                subtext: "",
                left: 'center',
                align: 'right'
                },
                grid: {
                bottom: 80
                },
                toolbox: {
                feature: {
                    dataZoom: {
                    yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                    backgroundColor: '#505765'
                    }
                }
                },
                legend: {
                data: [ "" , 'Precipitation'],
                left: 10
                },
                dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 30,
                    end: 40
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 30,
                    end: 40
                }
                ],
                xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    data: [].map(function (str) {
                    return str.replace(' ', '\n')
                    })
                }
                ],
                yAxis: [
                {
                    name: "",
                    type: 'value',
                    max: 1
                },
                {
                    name: 'Precipitation(mm)',
                    nameLocation: 'start',
                    max: 5,
                    type: 'value',
                    inverse: true
                }
                ],
                series: [
                {
                    name: "",
                    type: 'line',
                    animation: false,
                    areaStyle: {},
                    lineStyle: {
                    width: 1
                    },
                    markArea: {
                    silent: true,
                    data: [[{
                        xAxis: ""
                    }, {
                        xAxis: ""
                    }]]
                    },
                    data: []
                },
                {
                    name: 'Precipitation',
                    type: 'line',
                    yAxisIndex: 1,
                    animation: false,
                    areaStyle: {},
                    lineStyle: {
                    width: 1
                    },
                    markArea: {
                    silent: true,
                    data: [
                        [{
                        xAxis: ""
                        }, {
                        xAxis: ""
                        }]
                    ]
                    },
                    data: []
                }
                ]
            },
            tsSocket:null,
            ops: {
                bar: {
                    background: "#808695"
                }
            },
            participants:[
                {
                    userName:"abc"
                },
                {
                    userName:"bbcc"
                },
                {
                    userName:"cbc"
                },
                {
                    userName:"vcb"
                },
                {
                    userName:"abc"
                },
                {
                    userName:"bbcc"
                }
            ],
            recodeStep:1,
            originalRptData:{}
        }
    },
    methods:{
        getPageInfo(){
            var href = window.location.href;
            var url = href.split("&");

            for (var i = 0; i < url.length; i++) {
                if (/groupID/.test(url[i])) {
                    this.pageParams.pageId = url[i].match(/groupID=(\S*)/)[1];
                    continue;
                }

                if (/userID/.test(url[i])) {
                    this.pageParams.userId = url[i].match(/userID=(\S*)/)[1];
                    continue;
                }

                if (/userName/.test(url[i])) {
                    this.pageParams.userName = url[i].match(/userName=(\S*)/)[1];
                    continue;
                }
            }
        },
        transTime(oldDay, oldTime){
            var timeArray = oldDay.split("-");
            var month="";
            switch(timeArray[0]){
                case "JAN":{
                    month = "1";break;
                }
                case "FEB":{
                    month = "2";break;
                }
                case "MAR":{
                    month = "3";break;
                }
                case "APR":{
                    month = "4";break;
                }
                case "MAY":{
                    month = "5";break;
                }
                case "JUN":{
                    month = "6";break;
                }
                case "JUL":{
                    month = "7";break;
                }
                case "AUG":{
                    month = "8";break;
                }
                case "SEPT":{
                    month = "9";break;
                }
                case "OCT":{
                    month = "10";break;
                }
                case "NOV":{
                    month = "11";break;
                }
                case "DEC":{
                    month = "12";
                }
            }
            var newDay = timeArray["2"] + "/" + month + "/" + timeArray["1"];
            var newTime = oldTime.substr(0,5);
            var newShowTime = newDay + " " + newTime;
            return newShowTime;
        },
        loadInpShow(){
            this.loadInpModal = true;
        },
        loadInp(){
            this.loadInpModal = false;
            this.inpData = true;
            this.initSelection();
        },
        loadRptShow(){
            this.loadRptModal = true;
        },
        loadRpt(){
            this.loadRptModal = false;
            this.rptData = true;
            this.initSelection();
        },
        initSelection(){
            if(this.inpData&&this.rptData){
                this.spinShow = true;
                this.originalData = true;
                //请求ObjectName列表
                this.axios
                .get(
                    "/PSWMM/data/objectNames" +
                    "?inpName=" + this.inpFileUrl
                )
                .then(res => {
                    this.spinShow = false;
                    if (res.data.code) {
                        this.updataSelection(res.data.data);
                    }
                    else{
                        confirm("error.");
                        console.log(res);
                    }
                })
                .catch(err => {
                    confirm("error.");
                    this.spinShow = false;
                });
            }
        },
        updataSelection(newObjectName){
            this.objectNames = newObjectName;
            this.objNameList = this.objectNames[this.selectType];
            this.selectName = this.objNameList[0];
            this.rainageList = this.objectNames["RainGage"];
            this.selectRaingage = this.rainageList[0];
        },
        selectedTypeChange(type){
            switch(type){
                case "Subcatchment":{
                    this.variableList = [
                        {
                            value:"Precip",
                            label:"Precipitation"
                        },
                        {
                            value:"Losses",
                            label:"Losses"
                        },
                        {
                            value:"Runoff",
                            label:"Runoff"
                        }];
                    break;
                }
                case "Node":{
                    this.variableList = [
                        {
                            value:"Inflow",
                            label:"Inflow"
                        },
                        {
                            value:"Flooding",
                            label:"Flooding"
                        },
                        {
                            value:"Depth",
                            label:"Depth"
                        },
                        {
                            value:"Head",
                            label:"Head"
                        }];
                    break;
                }
                case "Link":{
                    this.variableList = [
                        {
                            value:"Flow",
                            label:"Flow"
                        },
                        {
                            value:"Velocity",
                            label:"Velocity"
                        },
                        {
                            value:"Depth",
                            label:"Depth"
                        },
                        {
                            value:"Capacity",
                            label:"Capacity"
                        }];
                }
            }
            this.selectVariable = this.variableList[0].value;
            this.objNameList = this.objectNames[type];
            if(this.objNameList.length>0){
                this.selectName = this.objNameList[0];
            }
        },
        showTimeSeries(){
            if(this.originalData){
                this.spinShow = true;
                this.axios
                .get(
                    "/PSWMM/vision/timeSeries" +
                    "?inpName=" + this.inpFileUrl+
                    "&rptName=" + this.rptFileUrl +
                    "&objType=" + this.selectType+
                    "&objName=" + this.selectName+
                    "&variable=" + this.selectVariable
                )
                .then(res => {
                    this.spinShow = false;
                    if (res.data.code) {
                        this.originalRptData = res.data.data;
                        this.formatedData =  this.formatShowData(res.data.data);
                        this.visualization = true;
                        this.updataChartOption(this.formatedData);
                        this.toVisualization();
                    }
                    else{
                        confirm("error.");
                        console.log(res);
                    }
                })
                .catch(err => {
                    confirm("error.");
                    this.spinShow = false;
                });
            }else{
                confirm("Load data, please.");
            }
        },
        resetRainLine(){
            this.formatedData =  this.formatShowData(this.originalRptData);
            this.updataChartOption(this.formatedData);
            this.toVisualization();
        },
        formatShowData(data){
            var timeLine = [];
            var variableLine = [];
            var rainLine = [];

            var raingageTimeLine = [];
            var raingages = data.raingages;
            for(var i=0;i<raingages.length;i++){
                if(raingages[i].name==this.selectRaingage){
                    raingageTimeLine = raingages[i].timeSeries;
                    break;
                }
            }
            var rainLineFormat = [];
            for(let i=0;i<raingageTimeLine.length;i+=this.recodeStep){
                rainLineFormat.push(raingageTimeLine[i]);
            } 
            var timeVariable = data.timeVariable;
            var y0Max = 0;
            var y1Max = 0;
            for(var i=0; i< timeVariable.length;i++){
                var item = timeVariable[i];
                var newTime = this.transTime(item.day, item.time);
                timeLine.push(newTime);
                if(item.variable > y0Max){
                    y0Max = item.variable;
                }
                variableLine.push(parseFloat(item.variable));
                if(rainLineFormat[i]){
                    if(rainLineFormat[i].value > y1Max){
                        y1Max = rainLineFormat[i].value;
                    }
                    rainLine.push(rainLineFormat[i].value);
                }
                else{
                    rainLine.push('0');
                }
            }
            var showData={
                timeLine:timeLine,
                variableLine:variableLine,
                rainLine:rainLineFormat,
                yAxis0Max: y0Max,
                yAxis1Max: y1Max
            }
            return showData;
        },
        updataChartOption(showData){
            this.chartOption = {
                title: {
                    text: this.selectVariable,
                    subtext: this.selectType + ' : ' + this.selectName,
                    left: 'center',
                    align: 'right'
                },
                grid: {
                    bottom: 80
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                            type: 'cross',
                            animation: false,
                            label: {
                            backgroundColor: '#505765'
                        }
                    }
                },
                legend: {
                    data: [ this.selectVariable , 'Precipitation'],
                    left: 10
                },
                dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 30,
                    end: 40
                }
                ],
                xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    data: showData.timeLine.map(function (str) {
                        return str.replace(' ', '\n')
                    })
                }
                ],
                yAxis: [
                {
                    name: this.selectVariable,
                    type: 'value',
                    max: showData.yAxis0Max
                },
                {
                    name: 'Precipitation(mm)',
                    nameLocation: 'start',
                    max: showData.yAxis1Max,
                    type: 'value',
                    inverse: true
                }
                ],
                series: [
                {
                    name: this.selectVariable,
                    type: 'line',
                    animation: false,
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    markArea: {
                    silent: true,
                    data: [[{
                        xAxis: showData.timeLine[0]
                    }, {
                        xAxis: showData.timeLine[showData.timeLine.length - 1]
                    }]]
                    },
                    data: showData.variableLine
                    //水深
                },
                {
                    name: 'Precipitation',
                    type: 'line',
                    yAxisIndex: 1,
                    animation: false,
                    areaStyle: {},
                    lineStyle: {
                    width: 1
                    },
                    markArea: {
                    silent: true,
                    data: [
                        [{
                        xAxis: showData.timeLine[0]
                        }, {
                        xAxis: showData.timeLine[showData.timeLine.length - 1]
                        }]
                    ]
                    },
                    data: showData.rainLine
                }
                ]
            }
        },
        toVisualization(){
            var echarts = require('echarts');
            var chartEle = document.getElementById('output-visualization-echarts');
            chartEle.style.width = (document.getElementById('chartContent').clientWidth * 0.8) + "px";
            this.timeSeriesPlot = echarts.init(chartEle);
            this.timeSeriesPlot.setOption(this.chartOption);
            chartEle.style.width = "100%";
        },
        reRenderChart(){
            this.timeSeriesPlot.setOption(this.chartOption);
        },
        connectSocket(){
            this.tsSocket=null;
            var ip_port = window.location.host;
            if(ip_port == "localhost:8084"){
                ip_port = "localhost:8086";
            }
            var soSocketUrl = "ws://" + ip_port + "/PSWMM/SimulationOptionsSocket/" + this.pageParams.pageId + "-ts";
            this.tsSocket = new WebSocket(soSocketUrl);
            this.tsSocket.onopen = this.onOpen;
            this.tsSocket.onmessage = this.onMessage;
            this.tsSocket.onclose = this.onClose;
            this.tsSocket.onerror = this.onError;
        },
        onOpen() {
            console.log("Socket连接成功！");
            this.sendMessage("connect",{});
            var that = this;
            window.setInterval(()=>{
                if(that.tsSocket!=null){
                    that.sendMessage("ping", {});
                }
            },20000);
        },
        onMessage(e) {
            var messageObject = JSON.parse(e.data);
            switch(messageObject.type){
                case "operation":{
                    this.inpData = true;
                    this.rptData = true;
                    this.originalData = true;
                    this.visualization = true;
                    this.selectType = messageObject.operation.selectType;
                    this.selectedTypeChange(this.selectType);
                    this.selectVariable = messageObject.operation.selectVariable;
                    this.updataSelection(messageObject.operation.objectNames);
                    this.selectName = messageObject.operation.selectName;
                    this.chartOption = messageObject.operation.chartOption;
                    this.toVisualization();
                    break;
                }
                case "members":{
                    this.participants = messageObject.memberList;
                }
            }
        },
        onClose(e) {
            this.runParametersModal = false;
            console.log("Socket连接断开！");
        },
        onError(e) {
            this.runParametersModal = false;
            console.log("Socket连接错误！");
        },
        sendMessage(type, operation){
            var userId = this.pageParams.userId;
            var userName = this.pageParams.userName;
            var message ={
                type: type,
                userInfo:{
                    userId: userId,
                    userName: userName
                },
                operation: operation
            }
            this.tsSocket.send(JSON.stringify(message));
        },
        submitOp(){
            var operation = {
                selectType:this.selectType,
                selectName:this.selectName,
                selectVariable:this.selectVariable,
                selectRaingage:this.selectRaingage,
                objectNames:this.objectNames,
                chartOption:this.chartOption
            };
            this.sendMessage("operation", operation);
        }
    }
}
</script>
