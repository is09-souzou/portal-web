export type location = "us" | "jp";

export const locale = {
    us: {
        profile: {
            displayName: "DisplayName",
            mailAdress: "Mail Adress",
            career: "Career",
            message: "Message",
            skill: "Skill",
            inputSkill: "Input Skill!",
            save: "save",
            cancel: "cancel",
            dialog: {
                submit: "submit",
                cancel: "cancel",
                title: "Upload Avatar"
            }
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
            language: "English",
            settings: "settings"
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
            career: "経歴",
            message: "一言",
            skill: "スキル",
            inputSkill: "スキルを入力してください",
            save: "保存",
            cancel: "キャンセル",
            dialog: {
                submit: "保存",
                cancel: "キャンセル",
                title: "アバター画像を選択"
            }
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
            language: "日本語",
            settings: "設定"
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
