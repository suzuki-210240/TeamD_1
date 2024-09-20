let savedData = [];
const maxClasses = 5 * 5; // 最大25コマ（5日×5時限）

// 新しい科目、教室、担当者を追加するための処理
function addOption(type) {
    const newValue = prompt('新しい値を入力してください:');
    if (newValue) {
        const selectElement = document.getElementById(type);
        const option = document.createElement('option');
        option.value = newValue;
        option.textContent = newValue;
        selectElement.appendChild(option);
    }
}

// 保存処理
function saveOptions() {
    const subject = document.getElementById('subject').value;
    const room = document.getElementById('room').value;
    const teacher = document.getElementById('teacher').value;
    const numClasses = parseInt(document.getElementById('numClasses').value);

    // 入力値チェック
    if (isNaN(numClasses) || numClasses < 1) {
        alert('週コマ数を正しく入力してください');
        return;
    }

    // 最大コマ数を超えた場合のエラーメッセージ
    if (numClasses > maxClasses) {
        alert(`エラー: 週コマ数が最大コマ数(${maxClasses})を超えています。`);
        return;
    }

    // 保存データの追加
    savedData.push({
        subject,
        room,
        teacher,
        numClasses
    });

    updateSavedList();
}

// 保存されたリストの更新処理
function updateSavedList() {
    const savedList = document.getElementById('savedList');
    savedList.innerHTML = ''; // 既存のリストをクリア

    savedData.forEach((data, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${data.subject} - ${data.room} - ${data.teacher} - ${data.numClasses}コマ`;

        // 削除ボタンを追加
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.onclick = () => deleteItem(index); // 削除ボタンのクリック時に処理を実行
        listItem.appendChild(deleteButton);

        savedList.appendChild(listItem);
    });
}

// 保存された項目を削除する処理
function deleteItem(index) {
    savedData.splice(index, 1); // 指定された項目を削除
    updateSavedList(); // リストを更新
}

// 週コマ数が時間割の限度を超えないかチェック
function checkTimetableCapacity() {
    const totalClasses = savedData.reduce((total, data) => total + data.numClasses, 0);

    if (totalClasses > maxClasses) {
        document.getElementById('errorMessage').textContent = `エラー: 週の合計コマ数(${totalClasses})が最大コマ数(${maxClasses})を超えています。`;
    } else {
        document.getElementById('errorMessage').textContent = '';
        generateTimetable();
    }
}

// 時間割を生成する処理
function generateTimetable() {
    const timetableBody = document.getElementById('timetable');
    timetableBody.innerHTML = ''; // 既存の時間割をクリア

    const days = ['月', '火', '水', '木', '金'];
    const periods = 5; // 1日あたりの時限数（5時限）
    let schedule = Array.from({ length: days.length }, () => Array(periods).fill(null));

    for (const data of savedData) {
        let count = 0;

        while (count < data.numClasses) {
            let dayIndex = Math.floor(Math.random() * days.length);
            let periodIndex = Math.floor(Math.random() * periods);

            // まだ埋まっていないコマにデータを追加
            if (!schedule[dayIndex][periodIndex]) {
                schedule[dayIndex][periodIndex] = `${data.subject} (${data.room}) ${data.teacher}`;
                count++;
            }
        }
    }

    // 時間割の表示
    for (let period = 0; period < periods; period++) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = `${period + 1}限`;
        row.appendChild(timeCell);

        days.forEach((day, dayIndex) => {
            const cell = document.createElement('td');
            if (schedule[dayIndex][period]) {
                cell.textContent = schedule[dayIndex][period];
            }
            row.appendChild(cell);
        });

        timetableBody.appendChild(row);
    }
}

// 画像生成処理
function generateImage() {
    const table = document.querySelector('#timetableTable');
    if (table) {
        html2canvas(table).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = 'timetable.png';
            link.click();
        }).catch(err => {
            console.error('エラーが発生しました:', err);
        });
    } else {
        alert('時間割がまだ生成されていません。');
    }
}
