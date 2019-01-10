/* tslint:disable:object-literal-key-quotes */

export type Location = "us" | "jp";

export type LocationText = (
    "Name" | "Display name" | "Mail address" | "Career" | "Message" |"Skill" | "Input skill" | "Save" | "Cancel" | "Submit" | "Select avatar image" |
    "Upload avatar" |"Title" | "Input title" | "Tags" | "Description" | "Input description" | "Image" | "Preview" | "Create" | "Update" | "Publish" |
    "Profile" | "Work list" | "Works" | "Designer" | "Popular" | "New" | "Languages" | "Language" | "Settings" | "Sign in" | "Sign out" | "Password" |
    "Create account" | "location" | "Initial registration profile" | "Input tags" | "User list" | "Work post" | "Work update"
);

export type LocationTextList = { [key in LocationText]: string };

const locationTextList:{ [key in Location]: LocationTextList } = {
    us: {
        "Name": "Name",
        "Display name": "Display Name",
        "Mail address": "Mail Address",
        "Career": "Career",
        "Message": "Message",
        "Skill": "Skill",
        "Input skill": "Input Skill",
        "Save": "Save",
        "Cancel": "Cancel",
        "Submit": "Submit",
        "Select avatar image": "Select Avatar Image",
        "Upload avatar": "Upload Avatar",
        "Title": "Title",
        "Input title": "Input Title",
        "Input tags": "Input tags",
        "Tags": "Tags",
        "Description": "Description",
        "Input description": "Input Description",
        "Image": "Image",
        "Preview": "Preview",
        "Create": "Create",
        "Update": "Update",
        "Publish": "Publish",
        "Profile": "Profile",
        "Work list": "Work List",
        "Works": "Works",
        "Designer": "Designer",
        "Popular": "Popular",
        "New": "New",
        "Languages": "Languages",
        "Language": "Language",
        "Settings": "Settings",
        "Sign in": "Sign In",
        "Sign out": "Sign Out",
        "Password": "Password",
        "Create account": "Create Acount",
        "location": "location",
        "Initial registration profile": "Initial Registration Profile",
        "User list": "User list",
        "Work post": "Work post",
        "Work update": "Work update"
    },
    jp: {
        "Name": "名前",
        "Display name": "表示名",
        "Mail address": "メールアドレス",
        "Career": "経歴",
        "Message": "一言メッセージ",
        "Skill": "スキル",
        "Input skill": "スキルを入力",
        "Save": "保存",
        "Cancel": "キャンセル",
        "Submit": "投稿",
        "Select avatar image": "アバター画像を選択",
        "Upload avatar": "アバターをアップロード",
        "Title": "タイトル",
        "Input title": "タイトルを入力",
        "Input tags": "タグを入力",
        "Tags": "タグ",
        "Description": "詳細",
        "Input description": "説明を入力",
        "Image": "画像",
        "Preview": "プレビュー",
        "Create": "作成",
        "Update": "更新",
        "Publish": "公開する",
        "Profile": "プロフィール",
        "Work list": "作品一覧",
        "Works": "作品一覧",
        "Designer": "デザイナー",
        "Popular": "人気",
        "New": "新着",
        "Languages": "言語",
        "Language": "言語",
        "Settings": "設定",
        "Sign in": "サインイン",
        "Sign out": "サインアウト",
        "Password": "パスワード",
        "Create account": "アカウントを作成",
        "location": "日本",
        "Initial registration profile": "プロフィールの初期登録",
        "User list": "ユーザ一覧",
        "Work post": "作品投稿",
        "Work update": "作品更新"
    }
};

export default locationTextList;
