function updateUsername(){
    document.getElementById('userName').innerText = sessionStorage.getItem("username");
};

updateUsername();

function updateRecentclaims(){
    let userId = sessionStorage.getItem("id");
    let claimsContainer = document.getElementById("recentClaims");
    fetch("http://localhost:3000/claims").then(async (response) => {
        if(!response.ok) {
            throw new Error("Fetch claims failed!");
        }
        allClaims = await response.json();
        filteredClaims = allClaims.filter((claim) => claim.userId === userId)
        filteredClaims.reverse();
        filteredClaims.forEach(claim => {
            claimsContainer.innerHTML += `<div class="col-sm-4 align-items-center mt-3">
            <div class="card">
              <div class="card-header bg-secondary text-white">
                CLM-${claim.id}
              </div>
              <div class="card-body">
                <div class="card-text px-2"><b>Reason:</b> ${claim.reason ? claim.reason : "missing"}.</div>
                <div class="card-text px-2"><b>Amount:</b> ${claim.amount ? claim.amount : "missing"}</div>
              </div>
              ${getStatusFooter(claim.status)}
            </div>
          </div>`
        });
    }).catch((e) => {
        console.log(e.message);
    })
}

function getStatusFooter(status) {
    switch (status) {
        case 'Submitted':
            return `<div class="card-footer text-dark bg-info">
                ${status}
              </div>`;
        case 'Approved':
            return `<div class="card-footer text-white bg-success">
                ${status}
              </div>`;
        case 'Rejected':
            return `<div class="card-footer text-white bg-danger">
                ${status}
              </div>`;
        default:
            return `<div class="card-footer text-muted">
                ${status}
              </div>`;
    }
}

updateRecentclaims();