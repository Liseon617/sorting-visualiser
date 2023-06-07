const n = 50;
const array = [];
let audioCtx = null;
let playing = false;
init();

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }

  const dur = 0.1;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}
function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }

  showBars();
  playing = false;
}

function play(sortType) {
  if (playing == false) {
    playing = !playing;
    const copy = [...array];
    let moves;
    if(sortType == "bubbleSort"){
      moves = bubbleSort(copy);
    } else if(sortType == "insertionSort"){
      moves = insertSort(copy);
    } else if(sortType == "quickSort"){

    } else if(sortType == "bucketSort"){

    }

    animate(moves);
  }
}

function animate(moves) {
  if (moves.length == 0 || playing == false) {
    showBars();
    playing = false;
    return;
  }

  const move = moves.shift();
  const [i, j] = move.indices;
  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }

  playNote(200 + array[i] * 500);
  playNote(200 + array[j] * 500);

  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 50); //100 milliseconds
}

function showBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");
    //highlight swapped parts of the array
    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}

//bubble sort
function bubbleSort(array) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      moves.push({
        indices: [i - 1, i],
        type: "comp",//comp
      });
      if (array[i - 1] > array[i]) {
        swapped = true;
        moves.push({
          indices: [i - 1, i],
          type: "swap",//swap
        });
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
  } while (swapped);
  return moves;
}

//insert sort
function insertSort(array) {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let valueToInsert = array[i];
    let holePosition = i;

    while ((holePosition > 0) && (array[holePosition - 1] > valueToInsert)) {
      // swapped = true;
      array[holePosition] = array[holePosition - 1];
      moves.push({
        indices: [holePosition, holePosition - 1],
        type: "swap",//swap
      });
      holePosition--;
    }
    array[holePosition] = valueToInsert;
    moves.push({
      indices: [holePosition, i],
      type: "comp",//compare
    });
  }
  return moves;
}

//quick sort
function quickSort(array) {
  let pivot = array[array.length - 1];
  let leftPointer = 0 ;
  let rightPointer = array.length - 1;

  function swap(array, index1, index2){
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  while(leftPointer < rightPointer){
    //walking from the left side
    //ensure that the values on the left of the pointer is less than the pivot
    while(array[leftPointer] <= pivot && leftPointer < rightPointer){
      leftPointer++;
    }

    //walking from the right side
    //ensure that the values on the right of the pointer is more than the pivot
    while(array[rightPointer] >= pivot && rightPointer > leftPointer){
      rightPointer--;
    }
    
    swap(array, leftPointer, rightPointer);
  }
  swap(array, leftPointer, array.length - 1);

  //recursive element
}
