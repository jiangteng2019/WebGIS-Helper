new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: {
        drawer: null,
        valid: true,
        map: null,
        originPoint: [31.172800343248, 121.406021546488],
        originZoom: 5,
        maxZoom: 18,
        minZoom: 1,
        mapId: 0,
        mapOptions: [
            {
                value: 0,
                text: '天地图'
            },
            {
                value: 1,
                text: '高德'
            },
            {
                value: 2,
                text: '谷歌'
            },
            {
                value: 3,
                text: '智图'
            },
            {
                value: 4,
                text: 'OSM'
            },
            {
                value: 5,
                text: '百度'
            }
        ],
        CoordinateObj: {
            'WGS84': [0, 4],
            'GCJ02': [1, 2, 3],
            'BD09': [5]
        },
        Coordinate: '',
        coordTypeObj: {
            'WGS84': 0,
            'GCJ02': 1,
            'BD09': 2
        },
        coordType: 0,
        pickMode: false,
        darkMode: false,
        autoMode: false,
        latitdue: 31.241464838702314,
        longitdue: 121.49531704483836,
        WGS84: [],
        GCJ02: [],
        BD09: [],
        rules: {
            latitdue: [
                val => (val || '').length > 0 || 'This field is required',
                val => (val < 90 && val  > -90 || 'out of bounds')
            ],
            longitude: [
                val => (val || '').length > 0 || 'This field is required',
                val => (val < 180 && val  > -180 || 'out of bounds')
            ]
        }
    },

    methods: {
        initMap(id = 0) {
            this.map ? (this.map.remove(), this.map = null): '';
            switch (id) {
                case 0 :
                    this.initTianMap();
                    break;
                case 1 :
                    this.initGaodeMap();
                    break;
                case 2 :
                    this.initGoogleMap();
                    break;
                case 3 :
                    this.initGeoqMap();
                    break;
                case 4 :
                    this.initOSMMap();
                    break;
                case 5 :
                    this.initBaiduMap();
                    break;
            }
            this.map.on('click', (e) => {
                if(this.pickMode) {
                    this.setCoordType();
                    let {lat, lng} = e.latlng;
                    this.latitdue = lat;
                    this.longitdue = lng;
                    if(this.autoMode) {
                        this.handleClick();
                    }
                }
            })
        },

        initTianMap() {
            this.map = L.map('map').setView(this.originPoint, this.originZoom);
            L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {maxZoom: this.maxZoom, minZoom: this.minZoom}).addTo(this.map);
            L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {maxZoom: this.maxZoom, minZoom: this.minZoom}).addTo(this.map);
        },

        initGaodeMap() {
            this.map = L.map('map').setView(this.originPoint, this.originZoom);
            L.tileLayer.chinaProvider('GaoDe.Normal.Map', {maxZoom: this.maxZoom, minZoom: this.minZoom}).addTo(this.map);
        },

        initGoogleMap() {
            this.map = L.map('map').setView(this.originPoint, this.originZoom);
            L.tileLayer.chinaProvider('Google.Normal.Map', {maxZoom: this.maxZoom, minZoom: this.minZoom}).addTo(this.map);
        },

        initGeoqMap() {
            this.map = L.map('map').setView(this.originPoint, this.originZoom);
            L.tileLayer.chinaProvider('Geoq.Normal.Map', {maxZoom: this.maxZoom, minZoom: this.minZoom}).addTo(this.map);
        },

        initOSMMap() {
            this.map = L.map('map').setView(this.originPoint, this.originZoom);
            L.tileLayer.chinaProvider('OSM.Normal.Map', {maxZoom: this.maxZoom, minZoom: this.minZoom}).addTo(this.map);
        },

        initBaiduMap() {
            this.initBaiduCRS();
            this.map = L.map('map',{crs: L.CRS.Baidu}).setView(this.originPoint, this.originZoom);
            L.tileLayer.baidu({layer: 'vec'}, {maxZoom: this.maxZoom, minZoom: this.minZoom}).addTo(this.map);
        },

        initBaiduCRS() {
            L.CRS.Baidu = new L.Proj.CRS("EPSG:900913", "+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs", {
                resolutions: (function() {
                    var level = 19;
                    var res = [];
                    res[0] = Math.pow(2, 18);
                    for (var i = 1; i < level; i++) {
                        res[i] = Math.pow(2, 18 - i);
                    }
                    return res;
                })(),
                origin: [0, 0],
                bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
            });
            L.tileLayer.baidu = function (option) {
                option = option || {};
                var layer;
                var subdomains = '0123456789';
                switch (option.layer) {
                    //单图层
                    case "vec":
                    default:
                        layer = L.tileLayer('http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'ph' : 'pl') + '&scaler=1&p=1', {
                            name:option.name,subdomains: subdomains, tms: true
                        });
                        break;
                    case "img_d": 
                        layer = L.tileLayer('http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46', {
                            name: option.name, subdomains: subdomains, tms: true
                        });
                        break;
                    case "img_z":
                        layer = L.tileLayer('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'sh' : 'sl') + '&v=020', {
                            name: option.name, subdomains: subdomains, tms: true
                        });
                        break;

                    case "custom"://Custom 各种自定义样式
                        //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
                        option.customid = option.customid || 'midnight';
                        layer = L.tileLayer('http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=' + option.customid, {
                            name: option.name, subdomains: "012", tms: true
                        });
                        break;

                    case "time"://实时路况
                        var time = new Date().getTime();
                        layer = L.tileLayer('http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=' + time + '&label=web2D&v=017', {
                            name: option.name, subdomains: subdomains, tms: true
                        });
                        break;
                        //合并
                    case "img":
                        layer = L.layerGroup([
                            L.tileLayer.baidu({ name: "底图", layer: 'img_d', bigfont: option.bigfont }),
                            L.tileLayer.baidu({ name: "注记", layer: 'img_z', bigfont: option.bigfont })
                        ]);
                        break;
                }
                return layer;
            };

        },

        addMarker(type) {
            if(this.WGS84.length === 0 || this.GCJ02.length === 0 || this.BD09.length === 0){ return }
            
            function setContent(p) {
                let content = `
                    <div class="popup_container">
                        <div class="popup_item">
                            <span class="popup_item_title">坐标系：</span>
                            <span>WGS84</span> 
                        </div>
                        <div class="popup_item">
                            <span class="popup_item_title">纬度：</span>
                            <span>${p[0]}</span>  
                        </div>
                        <div class="popup_item">
                            <span class="popup_item_title">经度：</span>
                            <span>${p[1]}</span>
                        </div>
                    </div>
                `
                return content;
            }

            switch(type) {
                case 'WGS84':
                    L.marker(this.WGS84).addTo(this.map).bindPopup(setContent(this.WGS84)).openPopup();
                    this.map.fitBounds([this.WGS84]);
                    break;
                case 'GCJ02':
                    L.marker(this.GCJ02).addTo(this.map).bindPopup(setContent(this.GCJ02)).openPopup();
                    this.map.fitBounds([this.GCJ02]);
                    break;
                case 'BD09':
                    L.marker(this.BD09).addTo(this.map).bindPopup(setContent(this.BD09)).openPopup();
                    this.map.fitBounds([this.BD09]);
                    break;
            }
        },

        handleMapChange(id) {
            this.initMap(id);
            this.getCurrentCoord(id);
        },

        getCurrentCoord(id) {
            for(let key in this.CoordinateObj) {
                if (this.CoordinateObj[key].includes(id)) {
                    this.Coordinate = key;
                    break;
                }
            }
        },

        setCoordType() {
            if(this.pickMode) {
                this.coordType = this.coordTypeObj[this.Coordinate];
            }
        },

        handleClick() {
            let valid = this.$refs.form.validate();
            if(valid) {
                if( !pointInChina([this.latitdue, this.longitdue])) {
                    this.WGS84 = this.GCJ02 = this.BD09 = [this.latitdue, this.longitdue];
                    return ;
                }
                let p = [this.longitdue, this.latitdue];  //调换经纬度
                switch (this.coordType) {
                    case 0 :
                        this.WGS84 = [this.latitdue, this.longitdue];
                        [this.GCJ02[1], this.GCJ02[0]] = gcoord.transform(p, gcoord.WGS84, gcoord.GCJ02);
                        [this.BD09[1], this.BD09[0]] = gcoord.transform(p, gcoord.WGS84, gcoord.BD09);
                        break;
                    case 1 :
                        [this.WGS84[1], this.WGS84[0]]  = gcoord.transform(p, gcoord.GCJ02, gcoord.WGS84);
                        this.GCJ02= [this.latitdue, this.longitdue];
                        [this.BD09[1], this.BD09[0]] = gcoord.transform(p, gcoord.GCJ02, gcoord.BD09);
                        break;
                    case 2 :
                        [this.WGS84[1], this.WGS84[0]]  = gcoord.transform(p, gcoord.BD09, gcoord.WGS84);
                        [this.GCJ02[1], this.GCJ02[0]] = gcoord.transform(p, gcoord.BD09, gcoord.GCJ02);
                        this.BD09= [this.latitdue, this.longitdue];
                        break;
                }
            }
        },

        handlePickModeChange(value) {
            if(value) {
                document.getElementById('map').style.cursor = 'crosshair';
                this.setCoordType();
            }else {
                document.getElementById('map').style.cursor = 'grab';
            }
        }

    },

    watch: {
        darkMode(value) {
            value ? this.$vuetify.theme.dark = true : this.$vuetify.theme.dark = false;
        }
    },

    mounted() {
        this.initMap(this.mapId);
        this.getCurrentCoord(this.mapId);
    },

    created() {
        this.$vuetify.theme.dark = false;
    },
})