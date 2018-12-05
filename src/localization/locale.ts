export type location = "us" | "jp";

export const locale = {
    us: {
        profile: {
            displayName: "DisplayName",
            mailAdress: "Mail Adress",
            carrer: "Carrer",
            message: "Message",
            skill: "Skill"
        },
        works: {
            title: "Title",
            inputTitle: "Input Title!",
            tags: "Tags",
            description: "Description",
            inputDiscription: "Input Discription!",
            image: "Image",
            preview: "Preview",
            create: "Create"
        },
        tab: {
            profile: "Profile",
            workList: "WorkList"
        },
        navigater: {
            works: "Works",
            designer: "Designer",
            popular: "Popular",
            new: "New",
            tags: "Tags",
            languages: "Languages",
            language: "English"
        },
        header: {
            name: "Name",
            mailAdress: "Mail Adress",
            profile: "Profile",
            signOut: "sign-out"
        },
        location: "us"
    },
    jp: {
        profile: {
            displayName: "ユーザー名",
            mailAdress: "メールアドレス",
            carrer: "経歴",
            message: "一言",
            skill: "スキル"
        },
        works: {
            title: "タイトル",
            inputTitle: "タイトルを入力してください",
            tags: "タグ",
            image: "画像",
            description: "説明",
            inputDiscription: "説明文を入力してください",
            preview: "プレビュー",
            create: "作成"
        },
        tab: {
            profile: "プロフィール",
            workList: "作品一覧"
        },
        navigater: {
            works: "作品",
            designer: "デザイナー",
            popular: "人気",
            new: "新規",
            tags: "タグ",
            languages: "言語",
            language: "日本語"
        },
        header: {
            name: "ユーザー名",
            mailAdress: "メールアドレス",
            profile: "プロフィール",
            signOut: "サインアウト"
        },
        location: "jp"
    }
};

export default locale;
