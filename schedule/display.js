var VERSION = 8;
var DATA = null;

function onData(data) {
  DATA = data;
  console.info('Got data');
  renderNext();
}

function renderNext() {
  if (!DATA) {
    console.info('No data');
    return;
  }
  var day = new Date().getDay() < 6 ? 0 : 1;
  findNextInTrack('back', DATA.backtrack[day]);
  findNextInTrack('side', DATA.sidetrack[day]);
  console.info('Rendered');
}

setInterval(renderNext, 2 * 1000);

function findNextInTrack(trackId, data) {
  var talk = {
    empty: true,
  };
  var time = new Date();
  for (var i = 0; i < data.length; i++) {
    var t = data[i];
    if (!t.startTime) {
      continue;
    }
    var start = t.startTime.split('.').map(str => parseInt(str, 10));
    var hour = start[0];
    var minute = start[1];
    console.info('Talk', hour, minute, time.getHours(), time.getMinutes())
    if (hour > time.getHours()
        || (hour == time.getHours() && minute > time.getMinutes())) {
      console.info('Found ', t);
      talk = t;
      break;
    }
  }
  if (talk.empty) {
    console.info('No next talk in ', trackId);
  }
  render(trackId, talk);
}

function render(id, data) {
  var root = document.getElementById(id);
  root.classList.toggle('active', !!data.who);
  root.querySelector('.speaker').textContent = data.who;
  root.querySelector('.talk').textContent = data.what;
  root.querySelector('.time').textContent = data.startTime;
}

function moreData() {
  getData().then(onData).catch(() => {
    setTimeout(moreData, 5 * 1000 * Math.random());
  });
}

moreData();
setInterval(moreData, 30 * 1000);


// Make sure that we pick up new versions.
setInterval(function() {
  fetch('./display.js?' + Date.now()).then(response => {
    return response.text();
  }).then(text => {
    var string = 'VERSION = ' + VERSION;
    if (text.indexOf(string) == -1) {
      // new version available
      location.href = location.pathname + '?' + Date.now();
    }
  });
}, 20 * 1000);

function makeLessCrappy(crappyData) {
  const entries = crappyData.feed.entry;
  const data = [];

  const tmp = entries.map(entry => ({
    address: entry.id.$t.replace(/.*\/R(\d+)C(\d+)$/, '$1,$2').split(',').map(Number),
    content: entry.content.$t
  }));

  tmp.forEach(({address, content}) => {
    const [row, col] = address;

    if(!data[row - 1]) { data[row - 1] = []; }
    data[row - 1][col - 1] = content.trim();
  });

  return data;
}

const columns = [
  'backtrack:startTime', 'backtrack:duration', 'backtrack:number',
  '-', 'backtrack:who', 'backtrack:what', '-',
  'sidetrack:startTime', 'sidetrack:duration', 'sidetrack:number',
  '-', 'sidetrack:who', 'sidetrack:what', '-'
];

function structureData(lessCrappyData) {
  let day = 0;
  const mergedRecords = {};

  for (let row = 2, nRows = lessCrappyData.length; row < nRows; row++) {
    if (row === 29) {
      day++;
    }

    if (!lessCrappyData[row]) { continue; }

    const tracks = {};
    for (let col = 0, nCols = lessCrappyData[row].length; col < nCols; col++) {
      if (!columns[col] || columns[col] === '-') { continue; }
      const [track, field] = columns[col].split(':');


      if (!tracks[track]) {
        tracks[track] = {};
      }

      tracks[track][field] = lessCrappyData[row][col];
    }

    Object.keys(tracks).forEach(track => {
      if (!mergedRecords[track]) {
        mergedRecords[track] = [];
      }
      if (!mergedRecords[track][day]) {
        mergedRecords[track][day] = [];
      }
      mergedRecords[track][day].push(tracks[track]);
    });
  }

  return mergedRecords;
}

function cleanup(data) {
  Object.keys(data).forEach(trackId => {
    const track = data[trackId];
    track.forEach((talks, day) => {
      data[trackId][day] = talks.filter(talk => Boolean(talk.what));
    })
  });

  return data;
}

function getData() {
  return fetch('https://spreadsheets.google.com/feeds/cells/1kjFshBwdJzAz4IT-02ZTPUTtQYYl4zk9IxuwsohOTos/od4/public/basic?alt=json')
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        var error = new Error(response.statusText || response.status);
        error.response = response;
        return Promise.reject(error)
      }
    })
    .then(res => res.json())
    .then(makeLessCrappy)
    .then(structureData)
    .then(cleanup)
    .then(data => {
      console.log(data);
      return data;
    });
}