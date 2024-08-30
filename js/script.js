const API_KEY1=config.API_KEY1
const API_KEY2=config.API_KEY2
const API_KEY3=config.API_KEY3

//for highlighting selected menu
if (window.location.pathname === '/index.html'){
    localStorage.removeItem("selected-option")
    var option=document.querySelector(".home")
    option.classList.add("selected-menu")
}
else{
    var selectedoption=localStorage.getItem("selected-option")
    
    var option=document.querySelector("."+selectedoption)
    option.classList.add("selected-menu")
}


document.getElementById("navbar-button").addEventListener("click",function(){
    var navbar=document.querySelector(".navbar")
    if (navbar.style.display=="none"){
       
        navbar.style.display="block"
    }
    else{
        navbar.style.display="none"
        navbar.style.position="fixed"
    }
})


function selectedmenu(element){
    localStorage.setItem("selected-option",element.classList[0])
    var option=document.querySelector(".selected-menu")
    if (option){
        option.classList.remove("selected-menu")
    }
    
    element.classList.add("selected-menu")
}

function homepage(){
    
    isloading=false
    let nextPageTokens={nextpage:""}
    
    async function fetchVideos(categoryId,nextPageToken="") {
        
        isloading=true
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=${categoryId}&regionCode=US&maxResults=48&pageToken=${nextPageToken}&key=${API_KEY1}`);
        const data = await response.json();
        nextPageTokens.nextpage=data.nextPageToken || ""
        isloading=false
        return data;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }
    
    async function displayRandomVideos() {

        const sportsVideos = await fetchVideos(17,nextPageTokens.nextpage); // Sports category ID
        const scienceVideos = await fetchVideos(28,nextPageTokens.nextpage); // Education category ID
        const gamesVideos = await fetchVideos(20,nextPageTokens.nextpage); // Gaming category ID
        const allVideos = [...sportsVideos.items,  ...gamesVideos.items,...scienceVideos.items];
        const shuffledVideos = shuffleArray(allVideos).slice(0, 24); // Display 10 random videos

        shuffledVideos.forEach(item => {
    
                var livestreamdetails=item
                var is_livevideo=false
                var currently_live=false
                if ("liveStreamingDetails" in livestreamdetails)
                {
                    is_livevideo=true
                if("concurrentViewers"  in livestreamdetails.liveStreamingDetails){
                    currently_live=true

                }
                }
                
                else{
                    is_livevideo=false
                }
                
                var videotitle=item.snippet.localized.title
                var videoid=item.id
                var channelname=item.snippet.channelTitle
                var videoviews=item.statistics.viewCount;
                var videoduration=item.contentDetails.duration
                videoduration=convertDurationToTime(videoduration)
                var videoPublishdate=item.snippet.publishedAt
                videoPublishdate=timeSince(videoPublishdate)
                var thumbnailurl=item.snippet.thumbnails
                var channelID=item.snippet.channelId
                if (thumbnailurl.maxres && thumbnailurl.maxres.url){
                    thumbnailurl=thumbnailurl.maxres.url
                }
                else{
                    thumbnailurl=thumbnailurl.high.url
                }

                videoviews=viewsCalculator(videoviews)

                getSubscribersCount(channelID).then(details => {
                    var channellogo=details.chanlLogo
                    var videodiv=""
                    if (currently_live && is_livevideo){
                        var videodiv=`
                    
                        <div class="homevideo-container col-12 col-sm-6  col-lg-4  mb-3 mx-0 px-0" data-videoid=${videoid}>
                            <div class="card border-0 px-2">
                            <div style="position:relative">
                            <img class="yt-video-thumbnail" src=${thumbnailurl}>
                            <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-danger mb-0 p-1 rounded">. Live </p>
                            </div>
                            <h5 class="my-2 yt-title">${videotitle}</h5>
                            <div class="d-flex align-items-center py-2">
                                <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                            </div>
                            <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 ${videoPublishdate}</span></p>
                            </div>
                        </div>
                        `
                    }

                    else if(!currently_live && is_livevideo){
                        var videodiv=`
                        
                        <div   class="homevideo-container col-12 col-sm-6  col-lg-4  mb-3 mx-0 px-0" data-videoid=${videoid}>
                            <div class="card border-0 px-2">
                            <div style="position:relative">
                                <img class="yt-video-thumbnail" src=${thumbnailurl}>
                                <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-dark mb-0 p-1 rounded">${videoduration}</p>
                            </div>
                            <h5 class="my-2 yt-title">${videotitle}</h5>
                            <div class="d-flex align-items-center py-2">
                                <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                            </div>
                            <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 Streamed ${videoPublishdate}</span></p>
                            </div>
                        </div>
                        `
                    }

                    else{
                        var videodiv=`
                        
                        <div  class="homevideo-container col-12 col-sm-6  col-lg-4  mb-3 mx-0 px-0 border-0" data-videoid=${videoid} >
                            <div class="card border-0 px-2">
                            <div style="position:relative">
                                <img class="yt-video-thumbnail" src=${thumbnailurl}>
                                <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-dark p-1 mb-0 rounded">${videoduration}</p>
                            </div>
                            <h5 class="my-2 yt-title">${videotitle}</h5>
                            <div class="d-flex align-items-center py-2">
                                <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                            </div>
                            <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 ${videoPublishdate}</span></p>
                            </div>
                        </div>
                        `
                    }
            
                    $(".home-page-container").append(videodiv)

                })

                const parentContainer = document.querySelector('.home-page-container');
                
                // Add event listener to the parent element
                parentContainer.addEventListener('click', function(event) {
                    // Check if the clicked element or its parent has the desired class name
                    let targetElement = event.target;

                    // Traverse up to find the thumbnail-container div
                    while (targetElement && !targetElement.classList.contains('homevideo-container')) {
                        targetElement = targetElement.parentElement;
                    }
                
                    if (targetElement && targetElement.classList.contains('homevideo-container')) {
                        // Perform actions specific to the clicked div
                        // Change background color of the selected div
                        const videoId = targetElement.dataset.videoid;
                        localStorage.setItem("videoid",videoId)
                        window.location.href="videoplay.html"
                        loadvideodetails()
                        
                    }  
                });
        });
    }
    
    window.addEventListener("scroll",function(){
        
        if ((window.innerHeight+window.scrollY)>=document.body.offsetHeight && !isloading){
            
            displayRandomVideos()
            
        }
    })
    displayRandomVideos();
}


function videoCategory(){

    var categoryId=$(".selected-menu").data("categoryid")
    localStorage.setItem("categoryId",categoryId)
}


async function videoCategoryload(){
    
    $(".videocategory-page-container").empty()
    var categoryId=localStorage.getItem("categoryId")
    isloading=false
    let nextPageTokens={nextpage:""}
    
    async function fetchVideos(categoryId,nextPageToken="") {
    
        isloading=true
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&videoCategoryId=${categoryId}&regionCode=US&maxResults=48&pageToken=${nextPageToken}&key=${API_KEY1}`);
        const data = await response.json();
        nextPageTokens.nextpage=data.nextPageToken || ""
        isloading=false
        return data;
    }
    
    
    async function displayCategoryVideos(categoryId) {
        
        const categoryVideos = await fetchVideos(categoryId,nextPageTokens.nextpage); // Sports category ID     
        const allVideos = [...categoryVideos.items];
    
        allVideos.forEach(item => {
            ;
                var livestreamdetails=item
                var is_livevideo=false
                var currently_live=false
                if ("liveStreamingDetails" in livestreamdetails)
                {
                    is_livevideo=true
                    if("concurrentViewers"  in livestreamdetails.liveStreamingDetails){
                        currently_live=true

                    }
                }
                
                else{
                    is_livevideo=false
                }
                
                
                var videotitle=item.snippet.localized.title
                var videoid=item.id
                var channelname=item.snippet.channelTitle
                var videoviews=item.statistics.viewCount;
                var videoduration=item.contentDetails.duration
                videoduration=convertDurationToTime(videoduration)
                var videoPublishdate=item.snippet.publishedAt
                videoPublishdate=timeSince(videoPublishdate)
                var thumbnailurl=item.snippet.thumbnails
                var channelID=item.snippet.channelId
                videoviews=viewsCalculator(videoviews)

                if (thumbnailurl.maxres && thumbnailurl.maxres.url){
                    thumbnailurl=thumbnailurl.maxres.url
                }

                else{
                    thumbnailurl=thumbnailurl.high.url
                }
                
            getSubscribersCount(channelID).then(details => {
                    
                var channellogo=details.chanlLogo
                var videodiv=""
                if (currently_live && is_livevideo){
                    var videodiv=`
                
                    <div class="homevideo-container col-12 col-sm-6  col-lg-4  mb-3 mx-0 px-0" data-videoid=${videoid}>
                        <div class="card border-0 px-2">
                        <div style="position:relative">
                        <img class="yt-video-thumbnail" src=${thumbnailurl}>
                        <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-danger mb-0 p-1 rounded">. Live </p>
                        </div>
                        <h5 class="my-2 yt-title">${videotitle}</h5>
                        <div class="d-flex align-items-center py-2">
                            <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                        </div>
                        <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 ${videoPublishdate}</span></p>
                        </div>
                    </div>
                    `
                }

                else if(!currently_live && is_livevideo){
                    var videodiv=`
                    
                    <div   class="homevideo-container col-12 col-sm-6  col-lg-4  mb-3 mx-0 px-0" data-videoid=${videoid}>
                        <div class="card border-0 px-2">
                        <div style="position:relative">
                            <img class="yt-video-thumbnail" src=${thumbnailurl}>
                            <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-dark mb-0 p-1 rounded">${videoduration}</p>
                        </div>
                        <h5 class="my-2 yt-title">${videotitle}</h5>
                        <div class="d-flex align-items-center py-2">
                            <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                        </div>
                        <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 Streamed ${videoPublishdate}</span></p>
                        </div>
                    </div>
                    `
                }

                else{
                    var videodiv=`
                    
                    <div  class="homevideo-container col-12 col-sm-6  col-lg-4  mb-3 mx-0 px-0 border-0" data-videoid=${videoid} >
                        <div class="card border-0 px-2">
                        <div style="position:relative">
                            <img class="yt-video-thumbnail" src=${thumbnailurl}>
                            <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-dark p-1 mb-0 rounded">${videoduration}</p>
                        </div>
                        <h5 class="my-2 yt-title">${videotitle}</h5>
                        <div class="d-flex align-items-center py-2">
                            <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                        </div>
                        <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 ${videoPublishdate}</span></p>
                        </div>
                    </div>
                    `
                }
            
            $(".videocategory-page-container").append(videodiv)

            })

            const parentContainer = document.querySelector('.videocategory-page-container');
                
                // Add event listener to the parent element
            parentContainer.addEventListener('click', function(event) {
                    // Check if the clicked element or its parent has the desired class name
                let targetElement = event.target;

                while (targetElement && !targetElement.classList.contains('homevideo-container')) {
                    targetElement = targetElement.parentElement;
                }
                    

                if (targetElement && targetElement.classList.contains('homevideo-container')) {
                    // Perform actions specific to the clicked div
                    // Change background color of the selected div
                    const videoId = targetElement.dataset.videoid;
                    localStorage.setItem("videoid",videoId)
                    
                    window.location.href="videoplay.html"
                    
                    loadvideodetails()
                    
                }
                    
                    
                       
            });
        });
    }

    
    window.addEventListener("scroll",function(){
        if ((window.innerHeight+window.scrollY)>=document.body.offsetHeight && !isloading){
            
            displayCategoryVideos(categoryId)
            
        }
    })
    
    displayCategoryVideos(categoryId);

}


$(document).ready(function(){
    var searchbar=$("#search-bar")

    $(".search-bar-button").click(function(){
        
            var search=searchbar.val()   
            if (search && search!==null){
                localStorage.setItem("search_query",search)
                window.location.href="searchresult.html"
                searchqueryretrive()
            }  
    })
    searchbar.keydown(function(e){
        if (e.which===13){

            var search=searchbar.val()
           
            if (search && search!==null){
                localStorage.setItem("search_query",search)
                window.location.href="searchresult.html"
                searchqueryretrive()
            }
            }
    })
})


function searchqueryretrive(){

    $(".row").empty()
    var search=localStorage.getItem("search_query")
    var nextPageToken=''
    var isloading=false
    videoSearch(API_KEY2,search,48)

    window.addEventListener("scroll",function(){

        if ((window.innerHeight+window.scrollY)>=document.body.offsetHeight && !isloading){
            videoSearch(API_KEY2,search,48)
        }
    })
    
    function videoSearch(API_KEY2,search,maxResults){

        isloading=true
        $.get("https://www.googleapis.com/youtube/v3/search?key="+API_KEY2+"&type=video,channel&part=snippet&maxResults="+maxResults+"&pageToken="+nextPageToken+"&q="+search,function(data){
            
            data.items.forEach(item => {
                var videotitle=item.snippet.title
                var channelname=item.snippet.channelTitle
                var videoid=item.id.videoId
                var channelID=item.id.channelId
                
                if (item.id.kind==="youtube#channel"){
                    getSubscribersCount(channelID).then(details => {
                        
                        localStorage.setItem("channel-id",channelID)
                        var videodiv=`

                        <div  id="thumbbbb"  class="channel-container col-12 col-sm-12 mb-5 mx-0 pt-3 px-0 d-flex " data-channelid=${channelID} >
                            <img class=" rounded-circle" src=${details.chanlLogo} style="width=100%;height:120px"  >
                            <div class="ms-3 d-flex flex-column justify-content-center">
                                <p class="h5">${channelname}</p>
                                <p>${viewsCalculator(details.subs)} Subscribers</p>
                            </div>
                        </div>
                        `
                        $(".row").append(videodiv)

                    })
                }
                
                getVideoDetails(videoid,videotitle,channelname,API_KEY1)
                nextPageToken=data.nextPageToken || ""
                isloading=false

            });             
        })
    }

    function getVideoDetails(videoid,videotitle,channelname,API_KEY){
        $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,liveStreamingDetails&id="+videoid+"&key="+API_KEY,function(data){
  
                var livestreamdetails=data.items[0]
                var is_livevideo=false
                var currently_live=false
                if ("liveStreamingDetails" in livestreamdetails)
                {
                    is_livevideo=true
                    if("concurrentViewers"  in livestreamdetails.liveStreamingDetails){
                        currently_live=true

                    }
                }
                
                else{
                    is_livevideo=false
                }

                var videoviews=data.items[0].statistics.viewCount;
                var videoduration=data.items[0].contentDetails.duration
                videoduration=convertDurationToTime(videoduration)
                var videoPublishdate=data.items[0].snippet.publishedAt
                videoPublishdate=timeSince(videoPublishdate)
                var thumbnailurl=data.items[0].snippet.thumbnails
                var channelID=data.items[0].snippet.channelId

                if (thumbnailurl.maxres && thumbnailurl.maxres.url){
                    thumbnailurl=thumbnailurl.maxres.url
                }

                else{
                    thumbnailurl=thumbnailurl.high.url
                }

                videoviews=viewsCalculator(videoviews)
                getSubscribersCount(channelID).then(details => {
                    
                    var channellogo=details.chanlLogo
                    
                    if (currently_live && is_livevideo){
                        var videodiv=`
                        
                        <div  id="thumbnail-container" class="thumbnail-container col-12 col-sm-12 mb-3  mx-0 px-0" data-videoid=${videoid} >
                            <div>
                                <div style="position:relative">
                                    <img class="yt-video-thumbnail" src=${thumbnailurl}>
                                    <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-danger mb-0 p-1 rounded">. Live </p>
                                </div>
                                
                            </div>
                            <div class=" ps-4">
                                
                                <h5 class="my-2 yt-title">${videotitle}</h5>
                                <div class="d-flex align-items-center ">
                                    <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                                </div>
                                <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 ${videoPublishdate}</span></p>
                            </div>
                        </div>
                        `
                    }

                    else if(!currently_live && is_livevideo){
                        var videodiv=`
                    
                        <div  id="thumbnail-container" class="thumbnail-container col-12 col-sm-12  mb-3 mx-0 px-0" data-videoid=${videoid} >
                            <div style="position:relative">

                                
                                <div style="position:relative" >
                                    <img class="yt-video-thumbnail" src=${thumbnailurl}>
                                    <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-dark p-1 mb-0 rounded">${videoduration}</p>
                                </div>


                            </div>
                            <div class=" ps-4">
                                
                                <h5 class="my-2 yt-title">${videotitle}</h5>
                                <div class="d-flex align-items-center ">
                                    <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                                </div>
                                <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 Streamed ${videoPublishdate}</span></p>
                            </div>
                        </div>
                        `
                    }

                    else{
                        var videodiv=`
                        
                        <div  id="thumbnail-container" class="thumbnail-container col-12 col-sm-12  mb-3 mx-0 px-0" data-videoid=${videoid} >
                            <div>
                                <div style="position:relative" >
                                    <img class="yt-video-thumbnail" src=${thumbnailurl}>
                                    <p style="position:absolute;bottom:10px;right:10px" class="text-white bg-dark p-1 mb-0 rounded">${videoduration}</p>
                                </div>
                               
                            </div>
                            <div class=" ps-4 ">
                                
                                <h5 class="my-2 yt-title">${videotitle}</h5>
                                <div class="d-flex align-items-center ">
                                    <img src="${channellogo}" class="rounded-pill channel-logo me-2"> <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                                </div>
                                <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 ${videoPublishdate}</span></p>
                            </div>
                        </div>
                        `
                    }
                    
                    $(".row").append(videodiv)
                })

                const parentContainer = document.querySelector('.row');
                // Add event listener to the parent element
                parentContainer.addEventListener('click', function(event) {
                    // Check if the clicked element or its parent has the desired class name
                    let targetElement = event.target;
                    // Traverse up to find the thumbnail-container div
                    while (targetElement && !targetElement.classList.contains('channel-container')) {
                        targetElement = targetElement.parentElement;
                    }
                    
                    if (targetElement && targetElement.classList.contains('channel-container')){
            
                        var channelID = targetElement.dataset.channelid
                        localStorage.setItem("channel-ID",channelID)
                        window.location.href="channelpage.html"

                        getChannelDetails()
            
                    }
                    targetElement = event.target

                    while (targetElement && !targetElement.classList.contains('thumbnail-container')) {
                        targetElement = targetElement.parentElement;
                    }
                    
                    if (targetElement && targetElement.classList.contains('thumbnail-container')) {
                        // Perform actions specific to the clicked div
                        // Change background color of the selected div
                        const videoId = targetElement.dataset.videoid;
                        localStorage.setItem("videoid",videoId)
                        window.location.href="videoplay.html"
                        loadvideodetails()
                        
                    }   
                });
        })     
    }
    

    var searchbar=$("#search-bar")
    
    $(".search-bar-button").click(function(){
        
        var search=searchbar.val()
    
        if (search && search!==null){
            localStorage.setItem("search_query",search)
            window.location.href="searchresult.html"
            searchqueryretrive()
        }
        
    })
    searchbar.keydown(function(e){
        if (e.which===13){

            var search=searchbar.val()
           
            if (search && search!==null){

                localStorage.setItem("search_query",search)
                window.location.href="searchresult.html"
                
                searchqueryretrive()
            }
            }
    })
}

function loadvideodetails(){

    var videoId=localStorage.getItem("videoid")    
    var API_KEY="AIzaSyAURq7_HaeKOv8RoxYkbEMyiwCmx7BV8u0"

    $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id="+videoId+"&key="+API_KEY2,function(data){
        if (data.items[0]){
            
            var videoTitle=data.items[0].snippet.title
            var videoViews=data.items[0].statistics.viewCount;
            var videoLikes=data.items[0].statistics.likeCount;
            videoViews=viewsCalculator(videoViews)
            var videoPublishdate=data.items[0].snippet.publishedAt
            videoPublishdate=timeSince(videoPublishdate)
            var channelID=data.items[0].snippet.channelId;
            var channelName=data.items[0].snippet.channelTitle
            var videoDescription=data.items[0].snippet.description
            var videoCommentsCount=data.items[0].statistics.commentCount;
    
            getSubscribersCount(channelID).then(details => {

                var subscribersCount=viewsCalculator(details.subs)
                var channellogo=details.chanlLogo
                localStorage.setItem("channel-ID",channelID)

                var videoplaydiv=`
                <iframe class="mt-0 mx-0 px-0" src="https://www.youtube.com/embed/${videoId}?autoplay=1&" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerpolicy="strict-origin-when-cross-origin" ></iframe>
                <h5 class="mt-2 mb-3 px-0 py-0">${videoTitle}</h5>
                <p class="my-0 px-0 mx-0 py-0 mb-3"><span>${videoViews} Views . </span><span>${videoPublishdate}</span> <img src="images/like.svg" id="like-button" style="height:24px;width:24px" class="ms-5"> <span style="vertical-align:bottom">${viewsCalculator(videoLikes)} </span> <span><img src="images/dislike.svg" id="dislike-button" style="height:24px;width:24px" class="ms-3"> </span>  </p>
                <hr class="mb-3" >
                <div class="d-flex align-items-center mt-0 mx-0 px-0 my-3">
                    <a href="channelpage.html"><img src="${channellogo}" onclick='getChannelDetails()' style="width:50px;height:50px;border-radius:50%"></a>
                    
                    <div class="mx-3">
                        <p class="mb-0" style="font-weight:700"> ${channelName} </p>
                        <p class="mb-0">${subscribersCount} Subscribers</p>
                    </div>
                    <button class="ms-4 button btn-dark b-0 p-2 px-3 d-flex align-items-center rounded-pill">SUBSCRIBE</p>
                </div>
                <hr  style="padding:0px">
                <div class=" mt-0 pt-0 mx-0 px-0">
                    <h3>Description</h2>
                    <p>${videoDescription}</p>
                </div>
                
                <div class="comments-container mt-3">
                    <hr>
                    <h1 class="mb-4">${videoCommentsCount} Comments</h1>
                    <hr>
                </div>
                
                `
                $(".yt-video-container").append(videoplaydiv)
                
            });   
        }
            var nextPageToken=''
            var is_loading=false
            
            fetchComments(videoId,50,is_loading,nextPageToken)
                .then(data => {
            
                    comments=data.data
                    nextPageToken=data.nextpagetoken
                    localStorage.setItem("nextpagetokencomments",nextPageToken)
                    for (i of comments){
                        var channelLogoUrl=i.snippet.topLevelComment.snippet.authorProfileImageUrl
                        var channelName=i.snippet.topLevelComment.snippet.authorDisplayName   
                        var userComment= i.snippet.topLevelComment.snippet.textOriginal
                        var userCommentedDate=i.snippet.topLevelComment.snippet.publishedAt
                        userCommentedDate=timeSince(userCommentedDate)
                        var userCommentLike=i.snippet.topLevelComment.snippet.likeCount
                        userCommentLike=viewsCalculator(userCommentLike)

                        var singlecommentdiv=`
                        <div d-flex flex-column>
                            <div class="d-flex ">
                                <img src="${channelLogoUrl}" class="rounded-circle me-2" style="width:30px;height:30px">
                                <p class="mb-0">${channelName} . ${userCommentedDate}</p>
                                
                            </div>
                            <div>
                                <p class="ms-4 ps-3">${userComment}</p>
                            </div>
                            <div class="d-flex align-items-end p-0">
                                <img src="images/like.svg" id="like-button" style="height:24px;width:24px" class="ms-5 me-1"><p class="m-0 ">${userCommentLike}</p><img src="images/dislike.svg" id="dislike-button" style="height:24px;width:24px" class="ms-4">
                            </div>
                            
                        </div>
                        <hr>`
                        $(".comments-container").append(singlecommentdiv)
                       
                    }
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                
            window.addEventListener("scroll",function(){
                nextPageToken=localStorage.getItem("nextpagetokencomments")
                
                if ((window.innerHeight+window.scrollY)>=document.body.offsetHeight && !is_loading &&nextPageToken){
                    
                    fetchComments(videoId,50,is_loading,nextPageToken)
                .then((data) => {
                    
                    comments=data.data
                    nextPageToken=data.nextpagetoken
                    localStorage.setItem("nextpagetokencomments",nextPageToken)

                    for (i of comments){
                        var channelLogoUrl=i.snippet.topLevelComment.snippet.authorProfileImageUrl
                        var channelName=i.snippet.topLevelComment.snippet.authorDisplayName   
                        var userComment= i.snippet.topLevelComment.snippet.textOriginal
                        var userCommentedDate=i.snippet.topLevelComment.snippet.publishedAt
                        userCommentedDate=timeSince(userCommentedDate)
                        var userCommentLike=i.snippet.topLevelComment.snippet.likeCount
                        userCommentLike=viewsCalculator(userCommentLike)
        
                        var singlecommentdiv=`
                        <div d-flex flex-column>
                            <div class="d-flex ">
                                <img src="${channelLogoUrl}" class="rounded-circle me-2" style="width:30px;height:30px">
                                <p class="mb-0">${channelName} . ${userCommentedDate}</p>
                                
                            </div>
                            <div>
                                <p class="ms-4 ps-3">${userComment}</p>
                            </div>
                            <div class="d-flex">
                                <img src="images/like.svg" id="like-button" style="height:24px;width:24px" class="ms-5 me-1"><p class="m-0">${userCommentLike}</p><img src="images/dislike.svg" id="dislike-button" style="height:24px;width:24px" class="ms-4">
                            </div>
                            
                        </div>
                        <hr>`
                        $(".comments-container").append(singlecommentdiv)
                       
                    }
                    
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                }
            })        
    })
    

    var searchbar=$("#search-bar")

    $(".search-bar-button").click(function(){

        var search=searchbar.val()
       
        if (search && search!==null){
            localStorage.setItem("search_query",search)
            window.location.href="searchresult.html"
            searchqueryretrive()
        }
        
})
    searchbar.keydown(function(e){
        if (e.which===13){

            var search=searchbar.val()
           
            if (search && search!==null){
                localStorage.setItem("search_query",search)
                window.location.href="searchresult.html"
                searchqueryretrive()
            }
            }
    })

    document.getElementById("navbar-button").addEventListener("click",function(){
        var navbar=document.querySelector(".navbar")

        if (navbar.style.display=="none"){
            navbar.style.display="block"
        }

        else{
            navbar.style.display="none"
            navbar.style.position="fixed"
        }
    })
}


function viewsCalculator(videoviews){
    if (videoviews>=1000 && videoviews<10000 && String(videoviews)[1]==0){
        videoviews=String(videoviews)[0]+"K"
    }
    else if (videoviews>=1100 && videoviews<10000){
        videoviews=String(videoviews)[0]+"."+String(videoviews)[1]+"K"
    }

    else if (videoviews>=100000 && videoviews<1000000){
        videoviews=String(videoviews)[0]+String(videoviews)[1]+String(videoviews)[2]+"K"
    }

    else if (videoviews>=10000 && videoviews<1000000){
        videoviews=String(videoviews)[0]+String(videoviews)[1]+"K"
    }

    else if (videoviews>=1000000 && videoviews<10000000 && String(videoviews)[1]==0){
        videoviews=String(videoviews)[0]+"M"
    }

    else if (videoviews>=1100000 && videoviews<10000000){
        videoviews=String(videoviews)[0]+"."+String(videoviews)[1]+"M"
    }

    else if (videoviews>=100000000 && videoviews<1000000000){
        videoviews=String(videoviews)[0]+String(videoviews)[1]+String(videoviews)[2]+"M"
    }

    else if (videoviews>=1000000 && videoviews<1000000000){
        videoviews=String(videoviews)[0]+String(videoviews)[1]+"M"
    }
    
    else if (videoviews>=1000000000 && videoviews<10000000000 && String(videoviews)[1]==0){
        videoviews=String(videoviews)[0]+"B"
    }
    else if (videoviews>=1100000000 && videoviews<10000000000){
        videoviews=String(videoviews)[0]+"."+String(videoviews)[1]+"B"
    }
    else if (videoviews>=1000000000 && videoviews<1000000000000){
        videoviews=String(videoviews)[0]+String(videoviews)[1]+"B"
    }
    return videoviews
}


async function fetchComments(videoId,maxResults,is_loading,nextPageToken) {
    is_loading=true
    apiKey="AIzaSyAURq7_HaeKOv8RoxYkbEMyiwCmx7BV8u0"
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY2}&maxResults=${maxResults}&order=relevance&pageToken=${nextPageToken}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        nextPageToken=data.nextPageToken || ""
        is_loading=false
        var datas={
            data:data.items,
            nextpagetoken:nextPageToken
        }
        return datas // Return the comments

    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
    
}


function getSubscribersCount(channelID){
    var API_KEY="AIzaSyAURq7_HaeKOv8RoxYkbEMyiwCmx7BV8u0"
    
    return new Promise((resolve,reject)=>{
        $.get("https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,brandingSettings&id="+channelID+"&key="+API_KEY3,function(data){
        if (data){
            var subscribersCount=data.items[0].statistics.subscriberCount
            var channelLogo=data.items[0].snippet.thumbnails.default.url
            var details={
                subs:subscribersCount,
                chanlLogo:channelLogo,
                
                datafull:data

            };
            resolve(details)
            
        }
        
        
    })
    });  
}

async function getChannelDetails(){

    document.getElementById("navbar-button").addEventListener("click",function(){
        var navbar=document.querySelector(".navbar")
        if (navbar.style.display=="none"){
           
            navbar.style.display="block"
        }
        else{
            navbar.style.display="none"
            navbar.style.position="fixed"
        }
    })



    channelId=localStorage.getItem("channel-ID")
    
    apiKey="AIzaSyAURq7_HaeKOv8RoxYkbEMyiwCmx7BV8u0"
    
    getSubscribersCount(channelId).then(details=>{
        
        
        channeldescription=details.datafull.items[0].brandingSettings.channel.description
        if (channeldescription===undefined){
            channeldescription=""
        }
        
        channellogo=details.datafull.items[0].snippet.thumbnails.medium.url
        channelname=details.datafull.items[0].brandingSettings.channel.title
        channelurl=details.datafull.items[0].snippet.customUrl
        subcount=details.datafull.items[0].statistics.subscriberCount
        videocount=details.datafull.items[0].statistics.videoCount
        
        channeldetail=`<div  id="thumbbbb" class="channel-container col-12 col-sm-12 mb-5 mx-0 mt-5 pt-5 d-flex flex-column ">
                            
                            <div class="d-flex">
                                <img class=" rounded-circle" src=${channellogo} style="width=100px;height:120px">
                                <div class="ms-3 d-flex flex-column justify-content-center">
                                <p class="h4">${channelname}</p>
                                <p class="mb-0">${channelurl}</p>
                                <p>${viewsCalculator(subcount)} subscribers . ${videocount} videos</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="px-5 mb-5">
                        <h3>Channel Description</h3>
                        <hr>
                        <p>${channeldescription}</p>
                        </div>
                        
                        `
        $(".channel-detail-container").append(channeldetail)

    })
    
    async function getChannelvideoSearch(){
        const url=`https://www.googleapis.com/youtube/v3/search?key=${API_KEY3}&channelId=${channelId}&part=snippet&maxResults=48&type=video&order=date`
        try{
            // is_loading=true
            const response=await fetch(url)
            const data=await response.json()
            // nextPageToken=data.nextPageToken || ""
            // localStorage.setItem("nextchannelvideopagetoken",data.nextPageToken)
            // is_loading=false
            data.items.forEach(item=>{
                
                var videoid=item.id.videoId
                var videotitle=item.snippet.title

                getChannelVideos(videoid,videotitle,channelname,API_KEY3,channelId)
                
            })
        }
        catch(error){
            console.log(error)
        }
    }
    // nextPageToken=""
    // var is_loading=false
    getChannelvideoSearch()

        // window.addEventListener("scroll",function(){
            
        //     nextPageToken=localStorage.getItem("nextchannelvideopagetoken")
        //     console.log(nextPageToken,"here i come")
        //     if ((window.innerHeight+window.scrollY+1000)>=document.body.offsetHeight && !is_loading && nextPageToken){
                
        //         getChannelvideoSearch(nextPageToken)
        
        //     }
        // }) 
}


function getChannelVideos(videoid,videotitle,channelname,API_KEY,channelID){
    $.get("https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,liveStreamingDetails&id="+videoid+"&key="+API_KEY,function(data){
        if (data.items[0]){
            
            var livestreamdetails=data.items[0]
            var is_livevideo=false
            var currently_live=false
            if ("liveStreamingDetails" in livestreamdetails)
            {
                is_livevideo=true
            if("concurrentViewers"  in livestreamdetails.liveStreamingDetails){
                currently_live=true

            }
            }
            
            else{
                is_livevideo=false
            }
            
            var videoviews=data.items[0].statistics.viewCount;
            var videoduration=data.items[0].contentDetails.duration
            videoduration=convertDurationToTime(videoduration)
            var videoPublishdate=data.items[0].snippet.publishedAt
            videoPublishdate=timeSince(videoPublishdate)
            var thumbnailurl=data.items[0].snippet.thumbnails
            if (thumbnailurl.maxres && thumbnailurl.maxres.url){
                thumbnailurl=thumbnailurl.maxres.url
            }
            else{
                thumbnailurl=thumbnailurl.high.url
            }
           
            videoviews=viewsCalculator(videoviews)
        
            var channelvideodiv=""
            if (currently_live && is_livevideo){
                var channelvideodiv=`
            
                <div  id="thumbbbb" class="thumbnail-container col-12 col-sm-6  col-lg-4 mb-3 mx-0 px-0" data-videoid=${videoid}>
                    <div class="new_div card" style="position:relative">
                        <img class="yt-video-thumbnail" src=${thumbnailurl}>
                        <div style="position:absolute;bottom:10px;right:10px" class="text-white bg-danger p-1 mb-0 rounded">. Live </div>
                    </div>
                    <div>
                    <h3 class="my-2 yt-title">${videotitle}</h3>
                    <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                    <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 ${videoPublishdate}</span></p>
                    </div>
                </div>
                `
            }
            else if(!currently_live && is_livevideo){
                var channelvideodiv=`
                
                <div  id="thumbbbb" class="thumbnail-container col-12 col-sm-6  col-lg-4  mb-3 mx-0 px-0" data-videoid=${videoid}>
                    <div class="new_div card" style="position:relative">
                        <img class="yt-video-thumbnail" src=${thumbnailurl}>
                        <div style="position:absolute;bottom:10px;right:10px" class="text-white bg-dark p-1 mb-0 rounded">${videoduration}</div>
                    </div>
                    <div>
                    <h3 class="my-2 yt-title">${videotitle}</h3>
                    <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                    <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 Streamed ${videoPublishdate}</span></p>
                    </div>
                </div>
                `
            }
            else{
                var channelvideodiv=`
            
                <div  id="thumbbbb" class="thumbnail-container col-12 col-sm-6  col-lg-4  mb-3 mx-0 px-0" data-videoid=${videoid} >
                    <div class="new_div card border-0 px-1" style="position:relative">
                        <img class="yt-video-thumbnail" src=${thumbnailurl}>

                        <div style="position:absolute;bottom:10px;right:10px" class="text-white bg-dark p-1 mb-0 rounded">${videoduration}</div>
                    </div>
                    <div >
                    <h3 class="my-2 yt-title">${videotitle}</h3>
                    <p class="yt-channel-name text-secondary fs-5 mb-0 pb-0">${channelname}</p>
                    <p class="text-secondary fs-5 mt-0 pt-0"><span class="yt-video-views">${videoviews} views</span>&nbsp;<span class="yt-video-publihsed-date">&#xb7 ${videoPublishdate}</span></p>
                    </div>
                </div>
                `
            }
            
            $(".row").append(channelvideodiv)
            const parentContainer = document.querySelector('.row');
            
            parentContainer.addEventListener('click', function(event) {
                
                let targetElement = event.target;

                while (targetElement && !targetElement.classList.contains('thumbnail-container')) {
                    targetElement = targetElement.parentElement;
                }
                if (targetElement && targetElement.classList.contains('thumbnail-container')) {
                    
                    const videoId = targetElement.dataset.videoid;
                    localStorage.setItem("videoid",videoId)
                    window.location.href="videoplay.html"
                    loadvideodetails()
                    
                }    
            });
        }             
    })
}


function timeSince(date) {
    const now = new Date();
    date=new Date(date)
    
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,  // 365 days
        month: 2592000, // 30 days
        week:604800,    //7 days
        day: 86400,      // 24 hours
        hour: 3600,      // 60 minutes
        minute: 60       // 60 seconds
    };

    let interval = Math.floor(seconds / intervals.year);
    if (interval >= 1) {
        return interval === 1 ? "1 year ago" : `${interval} years ago`;
    }

    interval = Math.floor(seconds / intervals.month);
    if (interval >= 1) {
        return interval === 1 ? "1 month ago" : `${interval} months ago`;
    }

    interval = Math.floor(seconds / intervals.week);
    if (interval >= 1) {
        return interval === 1 ? "1 week ago" : `${interval} weeks ago`;
    }

    interval = Math.floor(seconds / intervals.day);
    if (interval >= 1) {
        return interval === 1 ? "1 day ago" : `${interval} days ago`;
    }

    interval = Math.floor(seconds / intervals.hour);
    if (interval >= 1) {
        return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    }

    interval = Math.floor(seconds / intervals.minute);
    if (interval >= 1) {
        return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    }

    return Math.floor(seconds) === 1 ? "1 second ago" : `${Math.floor(seconds)} seconds ago`;
}




function convertDurationToTime(isoDuration) {
    let days = 0, hours = 0, minutes = 0, seconds = 0;
    let timePart = false;

    for (let i = 0; i < isoDuration.length; i++) {
      const char = isoDuration[i];

      if (char === 'P') {
        continue;
      } else if (char === 'T') {
        timePart = true;
      } else {
        let value = '';
        while (i < isoDuration.length && '0123456789'.includes(isoDuration[i])) {
          value += isoDuration[i];
          i++;
        }
        
        switch (isoDuration[i]) {
          case 'D':
            days = parseInt(value);
            break;
          case 'H':
            hours = parseInt(value);
            break;
          case 'M':
            if (timePart) {
              minutes = parseInt(value);
            }
            break;
          case 'S':
            seconds = parseInt(value);
            break;
        }
      }
    }


    hours += days * 24;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    if (isoDuration.includes("D")){
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }
    else if (isoDuration.includes("H")){
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }
    else if (isoDuration.includes("M")){
        return `${formattedMinutes}:${formattedSeconds}`
    }
    else if (isoDuration.includes("S")){
        return `0:${formattedSeconds}`
    }
    ;
  }

  

