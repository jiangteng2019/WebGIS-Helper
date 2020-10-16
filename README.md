# WebGIS Helper

###### [预览](http://htmlpreview.github.io/?https://github.com/jiangteng2019/WebGIS-Helper/blob/master/html/index.html)

#### 介绍
WebGIS-Helper 是一款基于 Chrome 扩展的坐标系转换插件，验证坐标转换的正确性。

#### 软件架构
WebGIS Helper 扩展运行在chrome浏览器中，使用 vue + Vuetify + Leaflet 等技术栈开发。


#### 安装教程

##### 方法一
1.  打开Chrome浏览器-设置-更多工具-扩展程序-打开开发者模式；
2.  克隆仓库，将 manifest.json 所在的上级文件夹直接拖拽至步骤1中开发者工具页面，直接在开发者模式下运行该插件；

##### 方法二
1.  dist文件夹下，直接拖拽 ctx 文件至扩展程序管理中直接安装；chrome 会阻止插件运行，其他使用chrome相同内核的浏览器可运行，如搜狗；
2.  后续将支持在 chrome 插件应用商店中下载安装。

#### 使用说明

1.  输入经纬度坐标，选择坐标系的类型，点击转换，查看对应转换后的坐标；
2.  点击定位按钮在地图中显示，注意要选择正确的转换格式，并在对应坐标系的地图中查看；地图的坐标系信息可在页首处查看；
3.  如遇问题，欢迎反馈。

