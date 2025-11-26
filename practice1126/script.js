// Initialize the map centered on Taiwan
const map = L.map('map').setView([23.6978, 120.9605], 8);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Data for the 10 highest mountains in Taiwan
const mountains = [
    {
        rank: 1,
        name: "玉山主峰 (Yushan Main Peak)",
        height: "3,952 m",
        coords: [23.4700, 120.9572],
        description: "台灣最高峰，也是東北亞最高峰，海拔3,952公尺。位於玉山國家公園中心，是台灣的精神象徵。地質上屬於變質岩，冬季常有積雪，景色如玉般潔白，故名「玉山」。登頂玉山是許多台灣人的夢想，象徵著毅力與挑戰。"
    },
    {
        rank: 2,
        name: "雪山主峰 (Xueshan Main Peak)",
        height: "3,886 m",
        coords: [24.3833, 121.2300],
        description: "台灣第二高峰，海拔3,886公尺，位於雪霸國家公園。以其壯麗的「雪山圈谷」冰河遺跡聞名，是台灣冰河地形最發達的地區。植被豐富，擁有全台面積最大的冷杉林。四季景色分明，冬季雪景更是迷人。"
    },
    {
        rank: 3,
        name: "玉山東峰 (Yushan East Peak)",
        height: "3,869 m",
        coords: [23.4706, 120.9633],
        description: "台灣第三高峰，海拔3,869公尺，位於玉山主峰東側。山勢極為陡峭，三面皆為斷崖，岩層裸露，險峻異常，被列為台灣「十峻」之首。攀登難度高，需要豐富的登山經驗與技巧。"
    },
    {
        rank: 4,
        name: "玉山北峰 (Yushan North Peak)",
        height: "3,858 m",
        coords: [23.4867, 120.9594],
        description: "台灣第四高峰，海拔3,858公尺。山頂設有全台灣海拔最高的氣象站——玉山氣象站，長年為台灣提供高山氣象資訊。從北峰眺望玉山主峰，是欣賞主峰壯麗山容的最佳角度之一，也是攝影愛好者的聖地。"
    },
    {
        rank: 5,
        name: "玉山南峰 (Yushan South Peak)",
        height: "3,844 m",
        coords: [23.4567, 120.9583],
        description: "台灣第五高峰，海拔3,844公尺。山脊蜿蜒曲折，岩石尖銳，形如游龍，氣勢非凡，故亦列為台灣「十峻」之一。位於玉山主峰南側，視野遼闊，可俯瞰楠梓仙溪溪谷。"
    },
    {
        rank: 6,
        name: "秀姑巒山 (Xiuguluan Mountain)",
        height: "3,825 m",
        coords: [23.4967, 121.0575],
        description: "台灣第六高峰，海拔3,825公尺，也是中央山脈的最高峰。山容壯麗寬廣，氣勢磅礴，與玉山、雪山、南湖大山、北大武山合稱「五岳」。位於南投與花蓮交界，是布農族人心中的聖山。"
    },
    {
        rank: 7,
        name: "馬博拉斯山 (Mabolasi Mountain)",
        height: "3,785 m",
        coords: [23.5203, 121.0672],
        description: "台灣第七高峰，海拔3,785公尺。位於秀姑巒山北側，山勢險峻陡峭，断崖處處，氣勢懾人，為台灣「十峻」之一。名稱源自布農族語，意為「白髮」，形容冬季積雪時的山容。"
    },
    {
        rank: 8,
        name: "南湖大山 (Nanhu Mountain)",
        height: "3,742 m",
        coords: [24.3619, 121.4394],
        description: "台灣第八高峰，海拔3,742公尺，位於中央山脈北段。山型端莊厚重，氣勢宏偉，素有「帝王之山」的美譽。擁有完整的冰河圈谷地形，景色壯麗獨特，是許多登山客心目中最美的山岳之一。"
    },
    {
        rank: 9,
        name: "東小南山 (Dongxiaonan Mountain)",
        height: "3,711 m",
        coords: [23.4390, 120.9634],
        description: "台灣第九高峰，海拔3,711公尺。位於玉山南峰南側，屬於玉山山脈。相較於鄰近的險峻山峰，東小南山山勢相對平緩開闊，碎石坡遍布，視野極佳，可眺望玉山群峰之美。"
    },
    {
        rank: 10,
        name: "中央尖山 (Central Range Point)",
        height: "3,705 m",
        coords: [24.3000, 121.4167],
        description: "台灣第十高峰，海拔3,705公尺。位於中央山脈北段，山形尖銳挺拔，如金字塔般直指天際，極具辨識度。與大霸尖山、達芬尖山合稱「三尖」，且為三尖之首，以險峻著稱，是登山者的一大挑戰。"
    }
];

// Add markers to the map
mountains.forEach(mountain => {
    // Create a custom numbered icon
    const numberIcon = L.divIcon({
        className: 'number-icon',
        html: mountain.rank,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const marker = L.marker(mountain.coords, { icon: numberIcon }).addTo(map);

    const popupContent = `
        <div class="popup-content">
            <h3 class="popup-title"><span style="color: var(--accent-color);">#${mountain.rank}</span> ${mountain.name}</h3>
            <div class="popup-info"><strong>高度：</strong> ${mountain.height}</div>
            <div class="popup-desc">${mountain.description}</div>
        </div>
    `;

    marker.bindPopup(popupContent);

    // Zoom to marker on click
    marker.on('click', function () {
        map.setView(mountain.coords, 14); // Zoom level 14
    });
});

// Zoom out to overview when popup is closed
map.on('popupclose', function () {
    map.setView([23.6978, 120.9605], 8); // Reset to initial view
});
