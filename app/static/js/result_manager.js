// Add this to a new file: result_manager.js

let results = [];

function openAddResultModal() {
  document.getElementById('addResultModal').style.display = 'flex';
}

function closeAddResultModal() {
  document.getElementById('addResultModal').style.display = 'none';
  document.getElementById('resultForm').reset();
}

function addSubjectField() {
  const subjectsContainer = document.getElementById('subjects');
  const subjectTemplate = document.querySelector('.subject-entry').cloneNode(true);
  
  // Clear input values in the clone
  subjectTemplate.querySelectorAll('input').forEach(input => input.value = '');
  subjectTemplate.querySelector('select').value = '';
  
  subjectsContainer.appendChild(subjectTemplate);
}

function handleResultSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const result = {
    id: Date.now(), // temporary ID for demo
    studentName: formData.get('studentName'),
    class: formData.get('class'),
    subjects: [],
    timestamp: new Date().toISOString(),
    shareLink: generateShareLink()
  };
  
  // Get all subjects and their scores
  const subjects = formData.getAll('subjects[]');
  const preTests = formData.getAll('preTest[]');
  const cas = formData.getAll('ca[]');
  const exams = formData.getAll('exam[]');
  
  subjects.forEach((subject, index) => {
    const total = parseInt(preTests[index]) + parseInt(cas[index]) + parseInt(exams[index]);
    result.subjects.push({
      name: subject,
      preTest: preTests[index],
      ca: cas[index],
      exam: exams[index],
      total: total,
      grade: calculateGrade(total)
    });
  });
  
  results.push(result);
  updateResultsList();
  closeAddResultModal();
  
  // You would typically send this to your backend here
  console.log('New result:', result);
}

function calculateGrade(total) {
  if (total >= 70) return 'A';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 45) return 'D';
  if (total >= 40) return 'E';
  return 'F';
}

function generateShareLink() {
  return `${window.location.origin}/results/${Date.now()}`;
}

function updateResultsList() {
  const resultsList = document.getElementById('resultsList');
  resultsList.innerHTML = results.map(result => `
    <div class="border rounded p-4 bg-white shadow-sm">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-semibold">${result.studentName}</h3>
          <p class="text-gray-600">Class: ${result.class}</p>
        </div>
        <button 
          onclick="shareResult('${result.shareLink}')"
          class="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          Share
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-50">
              <th class="p-2 text-left">Subject</th>
              <th class="p-2 text-center">Pre-Test</th>
              <th class="p-2 text-center">C/A</th>
              <th class="p-2 text-center">Exam</th>
              <th class="p-2 text-center">Total</th>
              <th class="p-2 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            ${result.subjects.map(subject => `
              <tr class="border-t">
                <td class="p-2">${subject.name}</td>
                <td class="p-2 text-center">${subject.preTest}</td>
                <td class="p-2 text-center">${subject.ca}</td>
                <td class="p-2 text-center">${subject.exam}</td>
                <td class="p-2 text-center">${subject.total}</td>
                <td class="p-2 text-center font-semibold">${subject.grade}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="mt-2 text-sm text-gray-500">
        Added on ${new Date(result.timestamp).toLocaleDateString()}
      </div>
    </div>
  `).join('');
}

function shareResult(shareLink) {
  // In a real application, you might want to use the Web Share API
  // or copy to clipboard
  navigator.clipboard.writeText(shareLink)
    .then(() => alert('Share link copied to clipboard!'))
    .catch(err => console.error('Failed to copy:', err));
}