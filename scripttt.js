document.getElementById("search-btn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();

    if (!username) {
        alert("Please enter a GitHub username");
        return;
    }

    // Clear existing data
    document.getElementById("profile").innerHTML = "";
    document.getElementById("repos").innerHTML = "";

    try {
        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) throw new Error("User not found");
        const userData = await userResponse.json();

        // Display user profile
        document.getElementById("profile").innerHTML = `
            <img src="${userData.avatar_url}" alt="${userData.login}'s avatar">
            <h2>${userData.name || userData.login}</h2>
            <div class="stats">
                <p>Public Repos: ${userData.public_repos}</p>
                <p>Followers: ${userData.followers}</p>
                <p>Following: ${userData.following}</p>
            </div>
        `;

        if (userData.public_repos === 0) {
            document.getElementById("profile").innerHTML = "<p>This user has no public repositories.</p>";
            return;
        }

        // Fetch user repositories
        const reposResponse = await fetch(userData.repos_url);
        if (!reposResponse.ok) throw new Error("Unable to fetch repositories");
        const reposData = await reposResponse.json();

        // Display repositories
        const reposContainer = document.getElementById("repos");
        reposContainer.innerHTML = "<h3>Repositories:</h3>";

        reposData.forEach(repo => {
            const repoElement = document.createElement("div");
            repoElement.className = "repo";
            repoElement.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        `;
            reposContainer.appendChild(repoElement);

        });
    } catch (error) {
        alert(error.message);
    }
});
