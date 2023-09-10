/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import {
    Box,
    Button,
    FormControl,
    Link,
    Modal,
    Paper,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Typography,
    createTheme,
    darken,
    lighten,
} from "@mui/material";
import "./index.scss";
import randomColor from "../../util/randomColor";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import isDarkOrLightColor from "../../util/isDarkorLightColor";

import { useEffect, useState } from "react";
import { TabPanelProps } from "@mui/lab";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import hljs from "highlight.js";

export default function DashBoard({
    setPage,
}: {
    setPage: (page: string) => void;
}) {
    setPage("dashboard");
    //@ts-ignore
    const [contents, setContents] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (Object.keys(user).length === 0) {
                window.location.href = "/login";
            }
            const { data } = await fetch(
                "https://cmt-backend.usersatoshi.repl.co/users/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + localStorage.getItem("token") || "",
                    },
                    body: JSON.stringify({
                        id: user.id,
                    }),
                },
            ).then((res) => res.json());

            setContents(data.contents);

            localStorage.setItem("user", JSON.stringify(data));
            console.log("data", data);
        })();
    }, []);

    return (
        <>
            <div className="dashboard">
                <div className="box">
                    <div className="headings">
                        <div className="title">Pages</div>
                        <div className="actions">
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineOutlinedIcon />}
                                onClick={() => setOpen(true)}
                            >
                                Create Content
                            </Button>
                        </div>
                    </div>
                    <div className="list">
                        {contents.map((content) => (
                            <ContentCard
                                name={content.title}
                                description={content.summary}
                                id={content.id.replaceAll(".", "_")}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <CreateContent
                open={open}
                setOpen={setOpen}
                setContents={setContents}
            />
        </>
    );
}

function ContentCard({
    name,
    description,
    id,
}: {
    name: string;
    description: string;
    id: string;
}) {
    const [color, setColor] = useState("#000");

    useEffect(() => {
        setColor(randomColor());
    }, []);
    return (
        <Link
            href={`/contents/${id}`}
            className="item"
            sx={{
                cursor: "pointer",
                backgroundColor: color,
                color:
                    isDarkOrLightColor(color) === "dark"
                        ? lighten(color, 0.7)
                        : darken(color, 0.7),
                textDecoration: "none",
            }}
        >
            <h3>{name}</h3>
            <p>{description}</p>
        </Link>
    );
}

function CreateContent({
    open,
    setOpen,
    setContents,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    setContents: (contents: any) => void;
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
        const d = await fetch(
            "https://cmt-backend.usersatoshi.repl.co/contents",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("token") || "",
                },
                body: JSON.stringify(data),
            },
        ).then((res) => res.json());
        console.log(data);
        setContents((contents: any[]) => [...contents, d.data]);
        // const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (Object.keys(user).length === 0) {
            window.location.href = "/login";
        }

        user.contents.push(d.data);
        localStorage.setItem("user", JSON.stringify(user));
        setOpen(false);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Paper elevation={3} sx={style}>
                    <FormControl className="form-control">
                        <Typography variant="h4" className="title">
                            Create Content
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
                            Create
                        </Button>
                    </FormControl>
                </Paper>
            </Modal>
        </ThemeProvider>
    );
}

function TabPanel(props: TabPanelProps) {
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
