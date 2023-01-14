import categories from './youtube_categories.json' assert {type: 'json'};

function getVideoDetails(videoId) {
    let apiKey = "AIzaSyBfUIhZD9uD8haODkkf2qt6ARWYol7tC3gASS"
    let URL = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${apiKey}`


    let videoDetails = {
        title: "",
        description: "",
        category: ""
    }

    axios.get(URL).then(
        resp => {
            videoDetails['title'] = resp['data']['items'][0]['snippet']['title']
            videoDetails['description'] = resp['data']['items'][0]['snippet']['description']
            videoDetails['category'] = categories[resp['data']['items'][0]['snippet']['categoryId']]
        }
    ).catch(
        err => {
            console.log("ERR")
        }
    )

    return videoDetails
}

console.log(getVideoDetails("Ks-_Mh1QhMc"))