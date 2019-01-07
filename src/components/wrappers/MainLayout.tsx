import { Drawer } from "@material-ui/core";
import React, { useState } from "react";
import Navigator from "src/components/molecules/Navigator";
import DrawerContext from "src/contexts/DrawerContext";
import LocalizationContext from "src/contexts/LocalizationContext";
import locationTextList, { Location } from "src/localization/locale";
import styled from "styled-components";

export default (
    {
        children
    }: React.Props<{}>
) => {
    const [locale, setLocale] = useState<Location>(
        () => {
            const language = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language;
            return language === "ja" || language === "ja-JP" ? "jp" : "us";
        }
    );
    const [drawerOpend, setDrawerOpen] = useState<boolean>(false);

    const toggleDrawer = () => setDrawerOpen(!drawerOpend);
    const handleLocale = () => setLocale(locale === "us" ? "jp" : "us");

    return (
        <Host>
            <LocalizationContext.Provider
                value={{
                    handleLocale,
                    locationText: locationTextList[locale]
                }}
            >
                <div>
                    <Drawer
                        variant="temporary"
                        anchor={"left"}
                        open={drawerOpend}
                        onClose={toggleDrawer}
                        ModalProps={{ keepMounted: true }}
                    >
                        <Navigator/>
                    </Drawer>
                </div>
                <div>
                    <Drawer
                        variant="permanent"
                        open
                    >
                        <Navigator/>
                    </Drawer>
                </div>
                <Content>
                    <DrawerContext.Provider
                        value={{ toggleDrawer }}
                    >
                        <Main>
                            {children}
                        </Main>
                    </DrawerContext.Provider>
                </Content>
            </LocalizationContext.Provider>
        </Host>
    );
};

const Host = styled.div`
    background-color: #fafbfd;
    > :nth-child(1) {
        display: none;
    }
    > :nth-child(2) {
        display: flex;
    }

    @media (max-width: 767px) {
        > :nth-child(1) {
            display: flex;
        }
        > :nth-child(2) {
            display: none;
        }
    }
`;

const Content = styled.div`
    position: relative;
    width: calc(100% - 15rem);
    margin-left: 15rem;
    @media (max-width: 767px) {
        width: 100%;
        margin-left: 0rem;
    }
`;

const Main = styled.main`
    min-height: calc(100vh - 7rem);
    margin-top: 7rem;
`;
