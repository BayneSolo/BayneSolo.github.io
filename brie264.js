function changePage(pageName) {
    var i, pagecontent, pagelinks;
    pagecontent = document.getElementsByClassName("pagecontent");
    for (i = 0; i < pagecontent.length; i++) {
        pagecontent[i].style.display = "none";
    }
    pagelinks = document.getElementsByClassName("pagelink");
    for (i = 0; i <pagelinks.length; i++) {
        pagelinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
}
function setDefault() {
    document.getElementById("Home").style.display = "block";
}
function getContact() {
    var output, address, telephone, email;
    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard");
    const streamPromise = fetchPromise.then(response => response.text());
    streamPromise.then(data => {
        telephone = data.split("TEL;WORK;VOICE:");
        telephone = telephone[1].split("ADR;");
        telephone = telephone[0];
        telephonecomb = telephone.replace(/\s+/g, '');
        address = data.split("PREF:;;");
        address = address[1].split("EMAIL:");
        address = address[0].replace(/;/g, ',');
        email = data.split("EMAIL:");
        email = email[1].split("PHOTO;");
        email = email [0];
        output = "<p class=align>Address: " + address + "</p><a href=\"tel:" + telephonecomb + "\">Telephone: " + telephone + "</a>\n <a href=\"mailto:" + email + "\">Email: " + email + "</a>";
        document.getElementById("contacts").innerHTML = output;
    })
}
function getNews() {
    var feed = "<h2>Newsfeed</h2>";
    feed += "<hr>";
    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news",
    {
        headers: {
            "Accept": "application/xml",
        },
    });
    const streamPromise = fetchPromise.then(response => response.text());
    streamPromise.then(data => {
        var xmlDoc = new window.DOMParser().parseFromString(data, "text/xml");
        for (var i = 0; i < xmlDoc.getElementsByTagName("RSSItem").length; i++) {
            feed += "<h3>" + xmlDoc.getElementsByTagName("RSSItem")[i].childNodes[5].innerHTML + "</h3>"; //Title
            feed += "<img src=\"" + xmlDoc.getElementsByTagName("RSSItem")[i].childNodes[1].childNodes[2].innerHTML + "\" class=center height=300px style=\"background-color:#FFFFFF\";>"; //Image
            feed += "<p>" + xmlDoc.getElementsByTagName("RSSItem")[i].childNodes[4].innerHTML + "</p>"; //Pub date
            feed += "<p>" + xmlDoc.getElementsByTagName("RSSItem")[i].childNodes[0].innerHTML + "</p>"; //Content
            feed += "<a href=" + xmlDoc.getElementsByTagName("RSSItem")[i].childNodes[3].innerHTML + " class=palign style=\"font-style: italic\";>Read further...</a>"; //Link to article
            feed += "<hr>";
        }
        document.getElementById("RSS").innerHTML = feed;
    });
}
function submitComment() {
    var form = document.forms.fetch;
    const handleSubmit = async (e) => {
        e.preventDefault();
        //var message = Object.fromEntries(new FormData(e.target));
        var comment = JSON.stringify(document.getElementById('comment').value);
        var name = document.getElementById('name').value;
        var fetchURL = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/comment?name=";
        fetchURL = (name === "") ? fetchURL + "👩" : fetchURL + name;

        const res = await fetchPromise(comment, fetchURL);
        const data = await res.json();

        getComments();
        form.reset();
    };
    const fetchPromise = (comment, fetchURL) => {
        return fetch(fetchURL,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: comment
        });
    };
    form.addEventListener('submit', handleSubmit);
}
function getComments() {
    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/htmlcomments");
    const streamPromise = fetchPromise.then(response => response.text());
    streamPromise.then(data => {
        document.getElementById("postedComments").innerHTML = data;
    });

}
function getProducts(fetchURL="http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items") {
    var products = "";
    const fetchPromise = fetch(fetchURL,
    {
        headers: {
            "Accept": "application/xml",
        },
    });
    const streamPromise = fetchPromise.then(response => response.text());
    streamPromise.then(data => {
        var xmlDoc = new window.DOMParser().parseFromString(data, "text/xml");
        for (var i = 0; i < xmlDoc.getElementsByTagName("Item").length; i++) {
            products += "<div>"
            products += "<h3 id=\"productTitle\">" + xmlDoc.getElementsByTagName("Item")[i].childNodes[3].innerHTML + "</h3>"; //Title
            products += "<img src=" + "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/itemimg?id=" + xmlDoc.getElementsByTagName("Item")[i].childNodes[0].innerHTML + " class=\"bound\">";
            products += "<p class=\"small\">Country of Origin: " + xmlDoc.getElementsByTagName("Item")[i].childNodes[1].innerHTML + "</p>"; //Origin
            products += "<p class=\"small\">Product Type: " + xmlDoc.getElementsByTagName("Item")[i].childNodes[4].innerHTML + "</p>"; //Type
            products += "<p>$" + xmlDoc.getElementsByTagName("Item")[i].childNodes[2].innerHTML + "</p>"; //Price
            products += "<button id=\"buybutton\">Buy</button>";
            products += "</div>";
        }
        document.getElementById("products").innerHTML = products;
    });
}
function searchProducts() {
    searchterm = document.getElementById('search').value;
    getProducts("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/search?term=" + searchterm);
}