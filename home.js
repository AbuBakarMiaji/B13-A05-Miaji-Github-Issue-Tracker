
const buttons = document.querySelectorAll(".btn-toggle");
const cards= document.getElementById('card-container');
const loadingSpinner = document.getElementById("loadingSpinner");
const cardsContainer = document.getElementById("card-container");
const issueCount = document.getElementById("issueCount");
const searchInput = document.getElementById("searchInput");


const issueModal = document.getElementById("issueModal");
const modalTitle = document.getElementById("modalTitle");
const modalStatus = document.getElementById("modalStatus");
const modalPriority = document.getElementById("modalPriority");
const modalLabels = document.getElementById("modalLabels");
const modalDescription = document.getElementById("modalDescription");
const modalAuthor = document.getElementById("modalAuthor");
const modalDate = document.getElementById("modalDate");
const assignee = document.getElementById("assignee");


// Loading section 
function showLoading() {
    loadingSpinner.classList.remove("hidden");
    cardsContainer.innerHTML = "";
}

function hideLoading() {
    loadingSpinner.classList.add("hidden");
}

let totalIssues = [];

async function allIssues(){
    showLoading();

    const res =await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const issues = await res.json();

    totalIssues = issues.data;
    displayIssues(totalIssues);

     hideLoading();
}

  allIssues();



//   Button Section 
buttons.forEach(button => {

    button.addEventListener("click", () => {

        showLoading();

        buttons.forEach(btn => {
            btn.classList.remove("btn-primary");
        });

        button.classList.add("btn-primary");
        

        const type = button.dataset.type;

        if (type === "all") {
            
            displayIssues(totalIssues);
            
        } else if (type === "open") {
            const openIssues = totalIssues.filter(issue => issue.status === "open");
            displayIssues(openIssues);
           
            
        } else if (type === "close") {
            const closedIssues = totalIssues.filter(issue => issue.status === "closed");
            displayIssues(closedIssues);
        }

        hideLoading();
    });

});



function displayIssues(issues) {

    cardsContainer.innerHTML = "";

    issueCount.textContent = issues.length + " Issues";

    issues.forEach(issue => {

        const card = document.createElement("div");

        

        let priorityClass = "";

        if (issue.priority === "high") {
            priorityClass = "bg-[#FEECEC] text-[#EF4444]";
        } else if (issue.priority === "medium") {
            priorityClass = "text-[#D97706] bg-[#FDE68A]";
        } else {
            priorityClass = "text-[#9CA3AF] bg-[#EEEFF2] ";
        }


        card.innerHTML = `
                <div class="w-[250px]  bg-white rounded-md shadow-md border-t-5 ${issue.status === "open" ? "border-[#00A96E]" : "border-[#A855F7]"}">
                   <div class="px-4 py-2 shadow-md">
                        <div class="flex justify-between mb-3">
                            ${issue.status === "open" ? "<img src='assets/Open-Status.png' alt='Open'>" : "<img src='./assets/Closed- Status .png' alt='Closed'> "}
                            <p class=" ${priorityClass} font-medium px-5 rounded-3xl">${issue.priority}</p>
                        </div>

                        <h2 class="text-[#1F2937] font-semibold text-[14px]">${issue.title}</h2>
                        <p class="line-clamp-2 text-[#64748B] text-[12px]">${issue.description}</p>

                        <div class="flex gap-4 my-2">

                            ${issue.labels.map((label) => {

                                if(label === "bug"){
                                    return `<div class="flex justify-center items-center gap-1 text-[12px] text-[#EF4444] font-medium bg-[#FECACA] py-1 px-3 rounded-xl">
                                    <i class="fa-solid fa-bug"></i> <p>Bug</p></div>`;
                                }

                                if(label === "help wanted"){
                                    return `<div class="flex justify-center items-center gap-1 text-[12px] text-[#D97706] font-medium bg-[#FDE68A] py-1 px-3 rounded-xl">
                                    <i class="fa-solid fa-life-ring"></i> <p>help wanted</p></div>`;
                                }

                                else {
                                    return `<div class="flex justify-center items-center gap-1 text-[12px] text-[#00A96E] font-medium bg-[#BBF7D0] py-1 px-3 rounded-xl">
                                    <i class="fa-solid fa-wand-magic-sparkles"></i> <p>${label}</p></div>`;
                                }

                            }).join("")}

                         </div>

                   </div>

                    <div class="bg-[#E4E4E7] px-4 py-2 text-[#64748B] text-[12px]">
                            <p>#${issue.author}</p>
                            <p>${issue.createdAt}</p>
                    </div>

                </div>
        `;

        card.addEventListener("click", () => {
            openModal(issue);
            });

        cardsContainer.appendChild(card);

    });

}



async function loadIssueDetails(id) {

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);

    const data = await res.json();

    const issue = data.data;

    showIssueModal(issue);

}


function showIssueModal(issue) {

    document.getElementById("modalTitle").textContent = issue.title;

    document.getElementById("modalDescription").textContent =
        issue.description;

    document.getElementById("modalStatus").textContent =
        "Status: " + issue.status;

    document.getElementById("modalPriority").textContent =
        "Priority: " + issue.priority;

    document.getElementById("modalAuthor").textContent =
        "Author: " + issue.author;

    document.getElementById("modalDate").textContent =
        "Created: " + new Date(issue.createdAt).toLocaleDateString();

    const labelsContainer = document.getElementById("modalLabels");

    labelsContainer.innerHTML = "";

    issue.labels.forEach(label => {

        const span = document.createElement("span");

        span.className = "badge badge-outline";

        span.textContent = label;

        labelsContainer.appendChild(span);

    });

        modal.showModal();

}


// Search Section

searchInput.addEventListener("input", async () => {
    const searchText = searchInput.value.trim(); 

    
    if (searchText === "") {
        displayIssues(totalIssues);
        return;
    }

    // Called the API when search box is not empty
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
        const data = await res.json();
        
        if (data.data) {
            displayIssues(data.data);
        }
    } catch (error) {
        console.error("Search failed:", error);
    }
});






