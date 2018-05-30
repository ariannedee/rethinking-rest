const commitFragment = `
fragment commitFragment on Repository {
  ref(qualifiedName: "master") {
    target {
      ... on Commit {
        history {
          totalCount
        }
      }
    }
  }
}
`;

const queryRepoList = `
query($login: String!){
  user(login: $login) {
    name
    repositories: repositoriesContributedTo(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        name
        id
      }
    }
  }
}
`;

const queryRepoSummary = `
query ($id: ID!) {
  node(id: $id) {
    ... on Repository {
      name: nameWithOwner
      starred: viewerHasStarred
      ...commitFragment
      issues (states: OPEN) {
        totalCount
      }
      pullRequests (states: OPEN) {
        totalCount
      }
    }
  }
}
` + commitFragment;

const mutationAddStar = `
mutation ($id: ID!){
  addStar(input: {starrableId: $id}) {
    starrable {
      ... on Repository {
        name
        starred: viewerHasStarred
      }
    }
  }
}
`;

const mutationRemoveStar = `
mutation ($id: ID!){
  removeStar(input: {starrableId: $id}) {
    starrable {
      ... on Repository {
        name
        starred: viewerHasStarred
      }
    }
  }
}
`;

function gqlRequest(query, variables, onSuccess) {
    $.post({
        url: "https://api.github.com/graphql",
        contentType: "application/json",
        headers: {
            Authorization: "bearer c203893ce0c6b37b3d85734408d09d35361ab345"
        },
        data: JSON.stringify({query: query, variables: variables}),
        success: onSuccess,
        error: (error) => console.log(error)
    });
}

function showDetails(element) {
    $(".selected-details").hide();
    gqlRequest(queryRepoSummary, {id: element.id}, (response) => {
        const repo = response.data.node;
        $(".selected-details").show();
        $(".no-selection").hide();
        $("#repoName").text(repo.name);
        let commits = 0;
        if (repo.ref) {
            commits = repo.ref.target.history.totalCount;
        }
        $("#repoCommits").text(commits);
        $("#repoIssues").text(repo.issues.totalCount);
        $("#repoPRs").text(repo.pullRequests.totalCount);
        $("button.star").attr("id", element.id);
        if (repo.starred) {
            $("button.star").text("Unstar");
        } else {
            $("button.star").text("Star");
        }
    });
}

$(window).ready(function() {
    gqlRequest(
        queryRepoList, 
        {login: "ariannedee"},
        (response) => {
            const user = response.data.user;
            $("header h2").text(`Hello ${user.name}!`);
            $("ol.repos").empty();
            user.repositories.nodes.forEach((repo) => {
                $("ol.repos").append(`<li id="${repo.id}" onClick="showDetails(this)">${repo.name}</li>`);
            });
        }
    );

    $("button.star").click((event) => {
        if ($(this).text()==="Star"){
            gqlRequest(
                mutationAddStar, 
                {id: this.id}, 
                () => $("button.star").text("Unstar")
            );
        } else {
            gqlRequest(
                mutationRemoveStar, 
                {id: this.id}, 
                () => $("button.star").text("Star")
            );
        }
    });
});