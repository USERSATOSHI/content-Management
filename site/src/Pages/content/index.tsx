/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    Modal,
    Paper,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
} from "@mui/material";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import EditIcon from "@mui/icons-material/Edit";
import * as React from "react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./index.scss";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useLocation } from "react-router-dom";
import { TabPanelProps } from "@mui/lab";
export default function Content() {
    const [content, setContent] = useState({
        title: "Test",
        summary: "this is a test description about a test content",
        content: `
# Test

this is a test

## Image Loading

![image](https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)

## Code

\`\`\`js
console.log("Hello World")
\`\`\`

## Link

this is a [link](https://google.com)

## Table

| Test | Test | Test |
| ---- | ---- | ---- |
| Test | Test | Test |
| Test | Test | Test |
| Test | Test | Test |
| Test | Test | Test |

## List

- Test
- Test
    - Test 2
- Test
    - Test 2
    - Test 2
`,
        author: {
            id: "test",
            username: "Test User",
        },
        id: "test",
    });

    const location = useLocation();

    useEffect(() => {
        const id = location.pathname
            .split("/")
            .pop()
            ?.split("_")
            .join(".") as string;
        (async () => {
            const { data } = await fetch(
                "https://cmt-backend.usersatoshi.repl.cohttps://cmt-backend.usersatoshi.repl.co/contents/" +
                    id,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + localStorage.getItem("token") || "",
                    },
                },
            ).then((res) => res.json());

            setContent(data);
            hljs.highlightAll();
        })();
    }, [location.pathname]);

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const [open, setOpen] = useState(false);

    return (
        <ThemeProvider theme={darkTheme}>
            <Box className="container">
                <div className="headings">
                    <div className="title">Preview</div>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => setOpen(true)}
                    >
                        Edit
                    </Button>
                </div>
                <Divider variant="fullWidth" className="divider" />
                <Box className="preview">
                    <div className="headings">
                        <Typography variant="h4" className="title">
                            Title: {content.title}
                        </Typography>
                        <Typography variant="h6" className="desc">
                            {content.summary}
                        </Typography>
                        <div className="avatar">
                            <Avatar>
                                {content.author.username[0].toUpperCase()}
                            </Avatar>{" "}
                            {content.author.username}
                        </div>
                    </div>
                    <Divider
                        variant="fullWidth"
                        sx={{
                            height: "1px",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            width: "90%",
                        }}
                    />
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className="markdown"
                        children={content.content}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        rehypePlugins={[rehypeRaw]}
                    />
                </Box>
            </Box>
            <EditContent
                open={open}
                setOpen={setOpen}
                contentData={content}
                setContentData={setContent}
            />
        </ThemeProvider>
    );
}

function EditContent({
    open,
    setOpen,
    contentData,
    setContentData,
}: {
    open: boolean;
    contentData: any;
    setOpen: (open: boolean) => void;
    setContentData: React.Dispatch<React.SetStateAction<any>>;
}) {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        minWidth: "300px",
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "2rem",
        gap: "16px",
        borderRadius: "8px",
        backgroundColor: "rgb(8,16,32)",
    } as const;

    const Create = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const data = {
            title,
            summary,
            content,
            author: {
                id: user.id,
                username: user.username,
            },
        };
        await fetch(
            "https://cmt-backend.usersatoshi.repl.cohttps://cmt-backend.usersatoshi.repl.co/contents/" +
                contentData.id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("token") || "",
                },
                body: JSON.stringify(data),
            },
        );
        console.log(data);
        // const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (Object.keys(user).length === 0) {
            window.location.href = "/login";
        }
        setContentData({ ...contentData, ...data });
        const index = user.contents.findIndex(
            (x: { id: any }) => x.id === contentData.id,
        );
        user.contents.splice(index, 1, { ...contentData, ...data });

        localStorage.setItem("user", JSON.stringify(user));
        setOpen(false);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Paper elevation={3} sx={style}>
                    <FormControl className="form-control">
                        <Typography variant="h4" className="title">
                            Edit Content
                        </Typography>

                        <TextField
                            label="Title"
                            variant="outlined"
                            value={title}
                            className="field"
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <TextField
                            label="Summary"
                            variant="outlined"
                            value={summary}
                            className="field"
                            onChange={(e) => setSummary(e.target.value)}
                        />

                        <BasicTabs content={content} setContent={setContent} />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={Create}
                        >
                            Edit
                        </Button>
                    </FormControl>
                </Paper>
            </Modal>
        </ThemeProvider>
    );
}

function TabPanel(props: TabPanelProps) {
    //@ts-ignore
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function BasicTabs({
    content,
    setContent,
}: {
    content: string;
    setContent: (content: string) => void;
}) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        hljs.highlightAll();
    }, [value]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "80%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Write" {...a11yProps(0)} />
                    <Tab label="Preview" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <TextField
                    label="Content"
                    variant="outlined"
                    multiline
                    rows={10}
                    sx={{
                        width: "100%",
                    }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    children={content}
                    rehypePlugins={[rehypeRaw]}
                    className="markdown half"
                />
            </TabPanel>
        </Box>
    );
}
