import PostView from "@/views/PostView";

export default interface PostSettingPage {

    getView: () => PostView;

    setView: (view: PostView) => void;

}