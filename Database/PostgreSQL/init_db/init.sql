--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6
-- Dumped by pg_dump version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AccessRoad; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."AccessRoad" (
    id_user integer NOT NULL,
    id_road integer NOT NULL,
    type_access character varying(255) NOT NULL
);


ALTER TABLE public."AccessRoad" OWNER TO admin;

--
-- Name: AccessRoad_id_road_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."AccessRoad_id_road_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AccessRoad_id_road_seq" OWNER TO admin;

--
-- Name: AccessRoad_id_road_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."AccessRoad_id_road_seq" OWNED BY public."AccessRoad".id_road;


--
-- Name: AccessRoad_id_user_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."AccessRoad_id_user_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."AccessRoad_id_user_seq" OWNER TO admin;

--
-- Name: AccessRoad_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."AccessRoad_id_user_seq" OWNED BY public."AccessRoad".id_user;


--
-- Name: permission; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL
);


ALTER TABLE public.permission OWNER TO admin;

--
-- Name: Permition_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Permition_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Permition_id_seq" OWNER TO admin;

--
-- Name: Permition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Permition_id_seq" OWNED BY public.permission.id;


--
-- Name: road; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.road (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    level character varying NOT NULL,
    image_path character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ward_id integer,
    location text DEFAULT 'unknown'::text NOT NULL,
    update_at timestamp without time zone,
    status character varying DEFAULT 'Not start'::character varying,
    report json
);


ALTER TABLE public.road OWNER TO admin;

--
-- Name: Road_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Road_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Road_id_seq" OWNER TO admin;

--
-- Name: Road_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Road_id_seq" OWNED BY public.road.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.role (
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.role OWNER TO admin;

--
-- Name: Role_permition_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Role_permition_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Role_permition_id_seq" OWNER TO admin;

--
-- Name: Role_permition_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Role_permition_id_seq" OWNED BY public.role.permission_id;


--
-- Name: Role_user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public."Role_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Role_user_id_seq" OWNER TO admin;

--
-- Name: Role_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public."Role_user_id_seq" OWNED BY public.role.user_id;


--
-- Name: account; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.account (
    id integer NOT NULL,
    email character varying(255),
    password character varying(255) NOT NULL,
    verified bigint,
    username character varying(255) NOT NULL,
    active boolean DEFAULT false NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.account OWNER TO admin;

--
-- Name: account_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_id_seq OWNER TO admin;

--
-- Name: account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.account_id_seq OWNED BY public.account.id;


--
-- Name: assignment; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.assignment (
    id integer NOT NULL,
    user_id integer NOT NULL,
    ward_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) DEFAULT 'Not start'::character varying,
    updated_at timestamp without time zone,
    deadline timestamp without time zone,
    comment text
);


ALTER TABLE public.assignment OWNER TO admin;

--
-- Name: assignment_district_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.assignment_district_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignment_district_id_seq OWNER TO admin;

--
-- Name: assignment_district_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.assignment_district_id_seq OWNED BY public.assignment.ward_id;


--
-- Name: assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.assignment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignment_id_seq OWNER TO admin;

--
-- Name: assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.assignment_id_seq OWNED BY public.assignment.id;


--
-- Name: assignment_user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.assignment_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignment_user_id_seq OWNER TO admin;

--
-- Name: assignment_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.assignment_user_id_seq OWNED BY public.assignment.user_id;


--
-- Name: ward; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ward (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    district_id integer NOT NULL
);


ALTER TABLE public.ward OWNER TO admin;

--
-- Name: ward_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.ward_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ward_id_seq OWNER TO admin;

--
-- Name: ward_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.ward_id_seq OWNED BY public.ward.id;


--
-- Name: district; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.district (
    id integer DEFAULT nextval('public.ward_id_seq'::regclass) NOT NULL,
    province_id integer,
    name character varying(255)
);


ALTER TABLE public.district OWNER TO admin;

--
-- Name: province; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.province (
    name text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.province OWNER TO admin;

--
-- Name: province_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.province_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.province_id_seq OWNER TO admin;

--
-- Name: province_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.province_id_seq OWNED BY public.province.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."user" (
    user_id integer NOT NULL,
    birthday date,
    fullname character varying(255),
    gender character varying(255),
    avatar character varying(255),
    location character varying(255),
    state character varying(255),
    phonenumber character varying
);


ALTER TABLE public."user" OWNER TO admin;

--
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_user_id_seq OWNER TO admin;

--
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;


--
-- Name: ward_district_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.ward_district_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ward_district_id_seq OWNER TO admin;

--
-- Name: ward_district_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.ward_district_id_seq OWNED BY public.ward.district_id;


--
-- Name: AccessRoad id_user; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."AccessRoad" ALTER COLUMN id_user SET DEFAULT nextval('public."AccessRoad_id_user_seq"'::regclass);


--
-- Name: AccessRoad id_road; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."AccessRoad" ALTER COLUMN id_road SET DEFAULT nextval('public."AccessRoad_id_road_seq"'::regclass);


--
-- Name: account id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.account ALTER COLUMN id SET DEFAULT nextval('public.account_id_seq'::regclass);


--
-- Name: assignment id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignment ALTER COLUMN id SET DEFAULT nextval('public.assignment_id_seq'::regclass);


--
-- Name: assignment user_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignment ALTER COLUMN user_id SET DEFAULT nextval('public.assignment_user_id_seq'::regclass);


--
-- Name: assignment ward_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignment ALTER COLUMN ward_id SET DEFAULT nextval('public.assignment_district_id_seq'::regclass);


--
-- Name: permission id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.permission ALTER COLUMN id SET DEFAULT nextval('public."Permition_id_seq"'::regclass);


--
-- Name: province id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.province ALTER COLUMN id SET DEFAULT nextval('public.province_id_seq'::regclass);


--
-- Name: road id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.road ALTER COLUMN id SET DEFAULT nextval('public."Road_id_seq"'::regclass);


--
-- Name: role user_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role ALTER COLUMN user_id SET DEFAULT nextval('public."Role_user_id_seq"'::regclass);


--
-- Name: role permission_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role ALTER COLUMN permission_id SET DEFAULT nextval('public."Role_permition_id_seq"'::regclass);


--
-- Name: user user_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user" ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- Name: ward id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ward ALTER COLUMN id SET DEFAULT nextval('public.ward_id_seq'::regclass);


--
-- Name: ward district_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ward ALTER COLUMN district_id SET DEFAULT nextval('public.ward_district_id_seq'::regclass);


--
-- Data for Name: AccessRoad; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."AccessRoad" (id_user, id_road, type_access) FROM stdin;
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.account (id, email, password, verified, username, active, created) FROM stdin;
101	\N	8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92	\N	caothi	t	2025-01-01 04:00:41.7002+00
31	lehuynhanhthu7403@gmail.com	8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92	74185	anhthu	t	2024-11-09 16:13:14.123556+00
106	\N	8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92	\N	baongan	t	2025-01-01 04:21:18.896096+00
113	\N	bcb15f821479b4d5772bd0ca866c00ad5f926e3580720659cc80d39c9d09802a	\N	nhatthu	t	2025-01-02 09:45:07.773285+00
18	caothi2003@gmail.com	8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92	50619	thi	t	2024-11-09 16:13:14.123556+00
69	nguyentrabaongan@gmail.com	bcb15f821479b4d5772bd0ca866c00ad5f926e3580720659cc80d39c9d09802a	42165	baongan123	t	2024-11-09 16:13:14.123556+00
128	tnthu.78@gmail.com	bcb15f821479b4d5772bd0ca866c00ad5f926e3580720659cc80d39c9d09802a	33963	nhatthu123	t	2025-01-03 17:34:50.872363+00
129	htra1204@gmail.com	d17f25ecfbcc7857f7bebea469308be0b2580943e96d13a3ad98a13675c4bfc2	\N	anhthu123	t	2025-01-03 19:00:53.988261+00
68	21522613@gm.uit.edu.vn	8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92	96338	caothiabc	t	2024-11-09 16:13:14.123556+00
70	thainhatthu.2003@gmail.com	bcb15f821479b4d5772bd0ca866c00ad5f926e3580720659cc80d39c9d09802a	70147	tes333	t	2024-11-09 16:13:14.123556+00
9	caothiu2003@gmail.com	8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92	48885	caothi123	t	2024-11-09 16:13:14.123556+00
\.


--
-- Data for Name: assignment; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.assignment (id, user_id, ward_id, created_at, status, updated_at, deadline, comment) FROM stdin;
60	106	181	2025-01-03 17:44:22.138874	Done	2025-01-03 17:44:31	2025-01-29 00:00:00	\N
61	101	182	2025-01-03 18:19:19.234752	Not start	\N	2025-01-22 00:00:00	\N
62	70	192	2025-01-03 18:51:27.971546	Not start	\N	2025-01-31 00:00:00	\N
64	70	155	2025-01-03 18:52:31.342551	Not start	\N	2025-01-23 00:07:00	\N
63	70	193	2025-01-03 18:52:13.833613	Done	2025-01-03 18:54:15	2025-01-29 00:00:00	\N
59	70	309	2025-01-03 17:40:39.676726	In progress	2025-01-03 18:54:30	2025-01-31 00:00:00	\N
\.


--
-- Data for Name: district; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.district (id, province_id, name) FROM stdin;
1	1	Quận Ba Đình
2	1	Quận Hoàn Kiếm
3	1	Quận Tây Hồ
4	1	Quận Long Biên
5	1	Quận Cầu Giấy
6	1	Quận Đống Đa
7	1	Quận Hai Bà Trưng
8	1	Quận Hoàng Mai
9	1	Quận Thanh Xuân
10	1	Quận Nam Từ Liêm
11	1	Quận Bắc Từ Liêm
12	1	Huyện Sóc Sơn
13	1	Huyện Đông Anh
14	1	Huyện Gia Lâm
15	1	Huyện Thanh Trì
16	1	Huyện Mê Linh
17	1	Huyện Ba Vì
18	1	Huyện Phúc Thọ
19	1	Huyện Thạch Thất
20	1	Huyện Quốc Oai
21	1	Huyện Chương Mỹ
22	1	Huyện Đan Phượng
23	1	Huyện Hoài Đức
24	1	Huyện Thanh Oai
25	1	Huyện Mỹ Đức
26	1	Huyện Ứng Hòa
27	1	Thị xã Sơn Tây
28	2	Quận Hồng Bàng
29	2	Quận Ngô Quyền
30	2	Quận Lê Chân
31	2	Quận Hải An
32	2	Quận Kiến An
33	2	Quận Đồ Sơn
34	2	Quận Dương Kinh
35	2	Huyện An Lão
36	2	Huyện Kiến Thuỵ
37	2	Huyện Thủy Nguyên
38	2	Huyện An Dương
39	2	Huyện Tiên Lãng
40	2	Huyện Vĩnh Bảo
41	2	Huyện Cát Hải
42	2	Huyện Bạch Long Vĩ
43	3	Thành phố Hạ Long
44	3	Thành phố Móng Cái
45	3	Thành phố Cẩm Phả
46	3	Thành phố Uông Bí
47	3	Huyện Bình Liêu
48	3	Huyện Đầm Hà
49	3	Huyện Hải Hà
50	3	Huyện Tiên Yên
51	3	Huyện Ba Chẽ
52	3	Huyện Đông Triều
53	3	Huyện Hoành Bồ
54	3	Huyện Vân Đồn
55	3	Thị xã Quảng Yên
56	3	Huyện Cô Tô
57	4	Thành phố Bắc Ninh
58	4	Huyện Yên Phong
59	4	Huyện Quế Võ
60	4	Huyện Tiên Du
61	4	Huyện Từ Sơn
62	4	Huyện Thuận Thành
63	4	Huyện Gia Bình
64	4	Huyện Lương Tài
65	5	Thành phố Phủ Lý
66	5	Huyện Duy Tiên
67	5	Huyện Kim Bảng
68	5	Huyện Thanh Liêm
69	5	Huyện Bình Lục
70	5	Huyện Lý Nhân
71	6	Thành phố Hải Dương
72	6	Thị xã Chí Linh
73	6	Huyện Nam Sách
74	6	Huyện Kinh Môn
75	6	Huyện Kim Thành
76	6	Huyện Thanh Hà
77	6	Huyện Cẩm Giàng
78	6	Huyện Bình Giang
79	6	Huyện Gia Lộc
80	6	Huyện Tứ Kỳ
81	6	Huyện Ninh Giang
82	6	Huyện Thanh Miện
83	45	Quận 1
84	45	Quận 3
85	45	Quận 4
86	45	Quận 5
87	45	Quận 6
88	45	Quận 7
89	45	Quận 8
90	45	Quận 10
91	45	Quận 11
92	45	Quận 12
93	45	Quận Bình Tân
94	45	Quận Bình Thạnh
95	45	Quận Gò Vấp
96	45	Quận Phú Nhuận
97	45	Quận Tân Bình
98	45	Quận Tân Phú
99	45	Thành phố Thủ Đức
100	45	Huyện Bình Chánh
101	45	Huyện Cần Giờ
102	45	Huyện Củ Chi
103	45	Huyện Hóc Môn
104	45	Huyện Nhà Bè
105	32	Quận Hải Châu
106	32	Quận Thanh Khê
107	32	Quận Sơn Trà
108	32	Quận Ngũ Hành Sơn
109	32	Quận Liên Chiểu
110	32	Quận Cẩm Lệ
111	32	Huyện Hòa Vang
112	32	Huyện Hoàng Sa
113	55	Quận Ninh Kiều
114	55	Quận Ô Môn
115	55	Quận Bình Thủy
116	55	Quận Cái Răng
117	55	Quận Thốt Nốt
118	55	Huyện Vĩnh Thạnh
119	55	Huyện Cờ Đỏ
120	55	Huyện Phong Điền
121	55	Huyện Thới Lai
214	47	Thành phố Thuận An
215	47	Thành phố Tân Uyên
216	47	Thành phố Dĩ An
217	47	Thị xã Bến Cát
218	47	Thành phố Thủ Dầu Một
219	47	Huyện Dầu Tiếng
220	47	Huyện Bàu Bàng
221	47	Huyện Phú Giáo
222	47	Huyện Bắc Tân Uyên
\.


--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.permission (id, name, description) FROM stdin;
1	admin	admin full access
2	technical	technical
3	user	user
\.


--
-- Data for Name: province; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.province (name, id) FROM stdin;
Hà Nội	1
Hải Phòng	2
Quảng Ninh	3
Bắc Ninh	4
Hà Nam	5
Hải Dương	6
Hưng Yên	7
Nam Định	8
Ninh Bình	9
Thái Bình	10
Vĩnh Phúc	11
Bắc Giang	12
Bắc Kạn	13
Cao Bằng	14
Điện Biên	15
Hà Giang	16
Hòa Bình	17
Lai Châu	18
Lạng Sơn	19
Lào Cai	20
Phú Thọ	21
Sơn La	22
Thái Nguyên	23
Tuyên Quang	24
Yên Bái	25
Thanh Hóa	26
Nghệ An	27
Hà Tĩnh	28
Quảng Bình	29
Quảng Trị	30
Thừa Thiên Huế	31
Đà Nẵng	32
Bình Định	33
Bình Thuận	34
Khánh Hòa	35
Ninh Thuận	36
Phú Yên	37
Quảng Nam	38
Quảng Ngãi	39
Đắk Lắk	40
Đắk Nông	41
Gia Lai	42
Kon Tum	43
Lâm Đồng	44
Thành phố Hồ Chí Minh	45
Bà Rịa - Vũng Tàu	46
Bình Phước	48
Đồng Nai	49
Tây Ninh	50
An Giang	51
Bạc Liêu	52
Bến Tre	53
Cà Mau	54
Cần Thơ	55
Đồng Tháp	56
Hậu Giang	57
Kiên Giang	58
Long An	59
Sóc Trăng	60
Tiền Giang	61
Trà Vinh	62
Vĩnh Long	63
Tỉnh Bình Dương	47
\.


--
-- Data for Name: road; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.road (id, user_id, latitude, longitude, level, image_path, created_at, ward_id, location, update_at, status, report) FROM stdin;
609	113	10.831293	106.6052	Very poor	roadImages/113_1735927639.8976483.jpg	2025-01-03 18:07:19.89795	67	Quốc lộ 1, Phường Tân Thới Nhất, Quận 12, Thành phố Hồ Chí Minh	\N	Not start	\N
610	113	10.825023	106.602979	Very poor	roadImages/113_1735927677.0969346.jpg	2025-01-03 18:07:57.097478	182	Quốc lộ 1, Phường Bình Hưng Hòa B, Quận Bình Tân, Thành phố Hồ Chí Minh	\N	Not start	\N
602	69	10.825933	106.694065	Good	roadImages/69_1735925036.335424.jpg	2025-01-03 17:23:56.336004	204	Dương Quảng Hàm, Phường 5, Quận Gò Vấp, Thành phố Hồ Chí Minh	2025-01-03 17:46:21	Done	\N
604	69	10.870728	106.757736	Very poor	roadImages/69_1735926157.7166224.jpg	2025-01-03 17:42:37.716838	309	Phường An Bình, Thành phố Dĩ An, Tỉnh Bình Dương	\N	Not start	\N
606	69	10.870728	106.757736	Very poor	roadImages/69_1735926223.4952557.jpg	2025-01-03 17:43:43.495596	309	Phường An Bình, Thành phố Dĩ An, Tỉnh Bình Dương	\N	Not start	\N
612	113	10.870712872142207	106.75764844056427	Very poor	roadImages/113_1735927967.3485055.jpg	2025-01-03 18:12:47.34884	309	Phường An Bình, Thành phố Dĩ An, Tỉnh Bình Dương	\N	Not start	\N
605	69	10.870728	106.757736	Good	roadImages/69_1735926207.5456178.jpg	2025-01-03 17:43:27.545782	309	Phường An Bình, Thành phố Dĩ An, Tỉnh Bình Dương	2025-01-03 17:56:26	Done	{"total_cost": 0.0, "incidental_costs": 0.0, "difficult": "string", "propose": "string"}
603	69	10.870728	106.757736	Good	roadImages/69_1735926147.631052.jpg	2025-01-03 17:42:27.631408	309	Phường An Bình, Thành phố Dĩ An, Tỉnh Bình Dương	2025-01-03 17:57:46	Done	\N
607	113	10.8706523	106.757841	Very poor	roadImages/113_1735927295.8837514.jpg	2025-01-03 18:01:35.884002	309	Phường An Bình, Thành phố Dĩ An, Tỉnh Bình Dương	\N	Not start	\N
608	113	10.829228	106.604073	Very poor	roadImages/113_1735927603.8567572.jpg	2025-01-03 18:06:43.85702	225	Quốc lộ 1, Xã Bà Điểm, Huyện Hóc Môn, Thành phố Hồ Chí Minh	\N	Not start	\N
591	113	10.794159655105563	106.61474496640818	Very poor	roadImages/113_1735921035.3894997.jpg	2025-01-03 16:17:15.389792	181	Chùa Di Lặc, Hẻm 596 Bình Long, Phường Bình Hưng Hòa A, Quận Bình Tân, Thành phố Hồ Chí Minh	\N	Not start	\N
613	128	10.816547	106.699375	Very poor	roadImages/128_1735928027.0119028.jpg	2025-01-03 18:13:47.012187	192	Hẻm 290/45 Nơ Trang Long, Phường 12, Quận Bình Thạnh, Thành phố Hồ Chí Minh	\N	Not start	\N
614	113	10.819908056084431	106.63904883852257	Very poor	roadImages/113_1735928113.2835398.jpg	2025-01-03 18:15:13.283865	155	Tân Sơn, Phường 15, Quận Tân Bình, Thành phố Hồ Chí Minh	\N	Not start	\N
615	113	10.751321	106.598489	Very poor	roadImages/113_1735928163.9633374.jpg	2025-01-03 18:16:03.963595	183	Đường số 48, Phường Tân Tạo, Quận Bình Tân, Thành phố Hồ Chí Minh	\N	Not start	\N
616	113	10.749904	106.595107	Poor	roadImages/113_1735928209.3926866.jpg	2025-01-03 18:16:49.393122	184	Cầu vượt Tân Tạo, Đường Lộ Tẻ, Phường Tân Tạo A, Quận Bình Tân, Thành phố Hồ Chí Minh	\N	Not start	\N
611	128	10.816973	106.69753	Good	roadImages/128_1735927936.1103556.jpg	2025-01-03 18:12:16.110555	193	235, Đường Nơ Trang Long, Phường 13, Quận Bình Thạnh, Thành phố Hồ Chí Minh	2025-01-03 18:53:28	Done	\N
587	113	10.870714922680575	106.75768220722223	Very poor	roadImages/113_1735920459.6660547.jpg	2025-01-03 16:07:39.667037	309	Phường An Bình, Thành phố Dĩ An, Tỉnh Bình Dương	\N	Not start	\N
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.role (user_id, permission_id) FROM stdin;
9	1
68	1
31	1
69	3
106	2
101	2
70	2
113	3
128	3
129	3
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."user" (user_id, birthday, fullname, gender, avatar, location, state, phonenumber) FROM stdin;
70	2024-10-12	Thái Nhật Thư 	Female	\N	Bình Dương	Vietnam	12345677
18	\N	\N	\N	\N	\N	\N	\N
68	\N	\N	\N	\N	\N	\N	\N
9	2003-11-10	Nguyễn Cao Thi	Male	avatar/caothi123.png		Vietnam	947791003
31	2024-04-07	Le Huynh Anh Thu	Female	avatar/anhthu.jpg	Ho Chi Minh	Viet Nam	0333478530
101	\N	\N	\N	\N	\N	\N	\N
69	2003-07-04	Le Huynh Anh Thu	Female	avatar/baongan123.png	Binh Duong	Viet Nam	333478530
106	2025-08-01	Thai Nhat Thu	Female	\N	Binh Duong	American Samoa	0907464382
128	\N	\N	\N	\N	\N	\N	\N
113	2021-12-11	Thai Nhat Thu	Female	avatar/nhatthu.jpg	Bình Dương	Vietnam	0907464382
129	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: ward; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ward (id, name, district_id) FROM stdin;
1	Phường An Khánh	99
2	Phường An Lợi Đông	99
3	Phường An Phú	99
4	Phường Bình Chiểu	99
5	Phường Bình Thọ	99
6	Phường Bình Trưng Đông	99
7	Phường Bình Trưng Tây	99
8	Phường Cát Lái	99
9	Phường Hiệp Bình Chánh	99
10	Phường Hiệp Bình Phước	99
11	Phường Hiệp Phú	99
12	Phường Linh Chiểu	99
13	Phường Linh Đông	99
14	Phường Linh Tây	99
15	Phường Linh Trung	99
16	Phường Linh Xuân	99
17	Phường Long Bình	99
18	Phường Long Phước	99
19	Phường Long Thạnh Mỹ	99
20	Phường Long Trường	99
21	Phường Phú Hữu	99
22	Phường Phước Bình	99
23	Phường Phước Long A	99
24	Phường Phước Long B	99
25	Phường Tam Bình	99
26	Phường Tam Phú	99
27	Phường Tăng Nhơn Phú A	99
28	Phường Tăng Nhơn Phú B	99
29	Phường Tân Phú	99
30	Phường Thảo Điền	99
31	Phường Thạnh Mỹ Lợi	99
32	Phường Thủ Thiêm	99
33	Phường Trường Thạnh	99
34	Phường Trường Thọ	99
35	Phường Bến Nghé	83
36	Phường Bến Thành	83
37	Phường Cô Giang	83
38	Phường Cầu Kho	83
39	Phường Cầu Ông Lãnh	83
40	Phường Nguyễn Cư Trinh	83
41	Phường Nguyễn Thái Bình	83
42	Phường Phạm Ngũ Lão	83
43	Phường Tân Định	83
44	Phường Đa Kao	83
45	Phường 1	84
46	Phường 2	84
47	Phường 3	84
48	Phường 4	84
49	Phường 5	84
50	Phường 9	84
51	Phường 10	84
52	Phường 11	84
53	Phường 12	84
54	Phường 13	84
55	Phường 14	84
56	Phường Võ Thị Sáu	84
57	Phường Thạnh Xuân	92
58	Phường Thạnh Lộc	92
59	Phường Hiệp Thành	92
60	Phường Thới An	92
61	Phường Tân Chánh Hiệp	92
62	Phường An Phú Đông	92
63	Phường Tân Thới Hiệp	92
64	Phường Trung Mỹ Tây	92
65	Phường Tân Hưng Thuận	92
66	Phường Đông Hưng Thuận	92
67	Phường Tân Thới Nhất	92
68	Phường 1	85
69	Phường 2	85
70	Phường 3	85
71	Phường 4	85
72	Phường 5	85
73	Phường 7	85
74	Phường 8	85
75	Phường 9	85
76	Phường 10	85
77	Phường 13	85
78	Phường 15	85
79	Phường 16	85
80	Phường 18	85
81	Phường 1	86
82	Phường 2	86
83	Phường 4	86
84	Phường 5	86
85	Phường 7	86
86	Phường 9	86
87	Phường 11	86
88	Phường 12	86
89	Phường 13	86
90	Phường 14	86
91	Phường 1	87
92	Phường 2	87
93	Phường 7	87
94	Phường 8	87
95	Phường 9	87
96	Phường 11	87
97	Phường 12	87
98	Phường 13	87
99	Phường 14	87
100	Phường Phú Mỹ	88
101	Phường Phú Thuận	88
102	Phường Bình Thuận	88
103	Phường Tân Phong	88
104	Phường Tân Phú	88
105	Phường Tân Hưng	88
106	Phường Tân Kiểng	88
107	Phường Tân Quy	88
108	Phường Tân Thuận Đông	88
109	Phường Tân Thuận Tây	88
110	Phường Rạch Ông	89
111	Phường 4	89
112	Phường 5	89
113	Phường 6	89
114	Phường 7	89
115	Phường Hưng Phú	89
116	Phường Xóm Củi	89
117	Phường 14	89
118	Phường 15	89
119	Phường 16	89
120	Phường 1	90
121	Phường 2	90
122	Phường 4	90
123	Phường 6	90
124	Phường 8	90
125	Phường 9	90
126	Phường 10	90
127	Phường 12	90
128	Phường 13	90
129	Phường 14	90
130	Phường 15	90
131	Phường 1	91
132	Phường 3	91
133	Phường 5	91
134	Phường 7	91
135	Phường 8	91
136	Phường 10	91
137	Phường 11	91
138	Phường 14	91
139	Phường 15	91
140	Phường 16	91
141	Phường 1	97
142	Phường 2	97
143	Phường 3	97
144	Phường 4	97
145	Phường 5	97
146	Phường 6	97
147	Phường 7	97
148	Phường 8	97
149	Phường 9	97
150	Phường 10	97
151	Phường 11	97
152	Phường 12	97
153	Phường 13	97
154	Phường 14	97
155	Phường 15	97
156	Phường Hòa Thạnh	98
157	Phường Phú Thạnh	98
158	Phường Hiệp Tân	98
159	Phường Phú Trung	98
160	Phường Phú Thọ Hòa	98
161	Phường Sơn Kỳ	98
162	Phường Tân Quý	98
163	Phường Tân Sơn Nhì	98
164	Phường Tân Thành	98
165	Phường Tân Thới Hòa	98
166	Phường Tây Thạnh	98
167	Phường 1	96
168	Phường 2	96
169	Phường 4	96
170	Phường 5	96
171	Phường 7	96
172	Phường 8	96
173	Phường 9	96
174	Phường 10	96
175	Phường 11	96
176	Phường 13	96
177	Phường 15	96
178	Phường An Lạc	93
179	Phường An Lạc A	93
180	Phường Bình Hưng Hòa	93
181	Phường Bình Hưng Hòa A	93
182	Phường Bình Hưng Hòa B	93
183	Phường Tân Tạo	93
184	Phường Tân Tạo A	93
185	Phường Bình Trị Đông A	93
186	Phường Bình Trị Đông B	93
187	Phường 1	94
188	Phường 2	94
189	Phường 5	94
190	Phường 7	94
191	Phường 11	94
192	Phường 12	94
193	Phường 13	94
194	Phường 14	94
195	Phường 17	94
196	Phường 19	94
197	Phường 22	94
198	Phường 25	94
199	Phường 26	94
200	Phường 27	94
201	Phường 28	94
202	Phường 1	95
203	Phường 3	95
204	Phường 5	95
205	Phường 6	95
206	Phường 8	95
207	Phường 10	95
208	Phường 11	95
209	Phường 12	95
210	Phường 14	95
211	Phường 15	95
212	Phường 16	95
213	Phường 17	95
223	Thị Trấn Hóc Môn	103
224	Xã Đông Thạnh	103
225	Xã Bà Điểm	103
226	Xã Nhị Bình	103
227	Xã Tân Hiệp	103
228	Xã Tân Thới Nhì	103
229	Xã Tân Xuân	103
230	Xã Thới Tam Thôn	103
231	Xã Trung Chánh	103
232	Xã Xuân Thới Đông	103
233	Xã Xuân Thới Sơn	103
234	Xã Xuân Thới Thượng	103
235	Xã An Thới Đông	101
236	Xã Bình Khánh	101
237	 Xã Cần Thạnh	101
238	Xã Long Hoà	101
239	Xã Lý Nhơn	101
240	Xã Tam Thôn Hiệp	101
241	Xã Thạnh An	101
242	Thị Trấn Cần Thạnh	101
243	Thị Trấn Nhà Bè	104
244	Xã Hiệp Phước	104
245	Xã Long Thới	104
246	Xã Nhơn Đức	104
247	Xã Phú Xuân	104
248	Xã Phước Kiển	104
249	Xã Phước Lộc	104
250	Thị Trấn Tân Túc	100
251	Xã Tân Kiên	100
252	Xã Tân Nhựt	100
253	Xã An Phú Tây	100
254	Xã Tân Quý Tây	100
255	Xã Hưng Long	100
256	Xã Qui Đức	100
257	Xã Bình Chánh	100
258	Xã Lê Minh Xuân	100
259	Xã Phạm Văn Hai	100
260	Xã Đình Xuyên	100
261	Xã Bình Hưng	100
262	Xã Bình Lợi	100
263	Xã Đa Phước	100
264	Xã Phong Phú	100
265	Xã Vĩnh Lộc A	100
266	Xã Vĩnh Lộc B	100
267	 Xã An Nhơn Tây	102
268	 Xã An Phú	102
269	 Xã Bình Mỹ	102
270	 Xã Hòa Phú	102
271	 Xã Nhuận Đức	102
272	 Xã Phạm Văn Cội	102
273	 Xã Phú Hòa Đông	102
274	 Xã Phú Mỹ Hưng	102
275	 Xã Phước Hiệp	102
276	 Xã Phước Thạnh	102
277	 Xã Phước Vĩnh An	102
278	 Xã Tân An Hội	102
279	 Xã Tân Phú Trung	102
280	 Xã Tân Thạnh Đông	102
281	 Xã Tân Thạnh Tây	102
282	 Xã Tân Thông Hội	102
283	 Xã Thái Mỹ	102
284	 Xã Trung An	102
285	 Xã Trung Lập Hạ	102
286	 Xã Trung Lập Thượng	102
287	Phường An Phú	214
288	Phường An Thạnh	214
289	Phường Bình Chuẩn	214
290	Phường Bình Hòa	214
291	Phường Bình Nhâm	214
292	Phường Hưng Định	214
293	Phường Lái Thiêu	214
294	Phường Thuận Giao	214
295	Phường Vĩnh Phú	214
296	Xã An Sơn	214
297	Phường Hội Nghĩa	215
298	Phường Khánh Bình	215
299	Phường Phú Chánh	215
300	Phường Tân Hiệp	215
301	Phường Tân Phước Khánh	215
302	Phường Tân Vĩnh Hiệp	215
303	Phường Thái Hòa	215
304	Phường Thạnh Phước	215
305	Phường Uyên Hưng	215
306	Phường Vĩnh Tân	215
307	Xã Bạch Đằng	215
308	Xã Thạnh Hội	215
309	Phường An Bình	216
310	Phường Bình An	216
311	Phường Bình Thắng	216
312	Phường Dĩ An	216
313	Phường Đông Hòa	216
314	Phường Tân Bình	216
315	Phường Tân Đông Hiệp	216
316	Phường Mỹ Phước	217
317	Phường Thới Hoà	217
318	Phường Hoà Lợi	217
319	Phường Tân Định	217
320	Phường Chánh Phú Hoà	217
321	Xã An Tây	217
322	Xã An Điền	217
323	Xã Phú An	217
324	Xã Chánh Mỹ	218
325	Xã Chánh Nghĩa	218
326	Xã Định Hòa	218
327	Xã Hiệp An	218
328	Xã Hiệp Thành	218
329	Xã Hòa Phú	218
330	Xã Phú Cường	218
331	Xã Phú Hòa	218
332	Xã Phú Lợi	218
333	Xã Phú Mỹ	218
334	Xã Phú Tân	218
335	Xã Phú Thọ	218
336	Xã Tân An	218
337	Xã Tương Bình Hiệp	218
338	Thị trấn Dầu Tiếng	28
339	Xã An Lập	28
340	Xã Định An	28
341	Xã Định Hiệp	28
342	Xã Định Thành	28
343	Xã Long Hòa	28
344	Xã Long Tân	28
345	Xã Minh Hòa	28
346	Xã Minh Tân	28
347	Xã Minh Thạnh	28
348	Xã Thanh An	28
349	Xã Thanh Tuyền	28
350	Thị trấn Lai Uyên	220
351	Xã Cây Trường II	220
352	Xã Hưng Hòa	220
353	Xã Lai Hưng	220
354	Xã Long Nguyên	220
355	Xã Tân Hưng	220
356	Xã Trừ Văn Thố	220
357	Thị trấn Phước Vĩnh	221
358	Xã An Bình	221
359	Xã An Linh	221
360	Xã An Long	221
361	Xã An Thái	221
362	Xã Phước Hòa	221
363	Xã Phước Sang	221
364	Xã Tam Lập	221
365	Xã Tân Hiệp	221
366	Xã Tân Long	221
367	Xã Vĩnh Hòa	221
368	Thị trấn Tân Thành	222
369	Thị trấn Tân Bình	222
370	Xã Bình Mỹ	222
371	Xã Đất Cuốc	222
372	Xã Hiếu Liêm	222
373	Xã Lạc An	222
374	Xã Tân Định	222
375	Xã Tân Lập	222
376	Xã Tân Mỹ	222
377	Xã Thường Tân	222
\.


--
-- Name: AccessRoad_id_road_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."AccessRoad_id_road_seq"', 1, false);


--
-- Name: AccessRoad_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."AccessRoad_id_user_seq"', 1, false);


--
-- Name: Permition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Permition_id_seq"', 3, true);


--
-- Name: Road_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Road_id_seq"', 616, true);


--
-- Name: Role_permition_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Role_permition_id_seq"', 1, false);


--
-- Name: Role_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public."Role_user_id_seq"', 1, false);


--
-- Name: account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.account_id_seq', 129, true);


--
-- Name: assignment_district_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.assignment_district_id_seq', 1, true);


--
-- Name: assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.assignment_id_seq', 64, true);


--
-- Name: assignment_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.assignment_user_id_seq', 1, false);


--
-- Name: province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.province_id_seq', 63, true);


--
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_user_id_seq', 1, false);


--
-- Name: ward_district_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.ward_district_id_seq', 1, false);


--
-- Name: ward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.ward_id_seq', 377, true);


--
-- Name: permission Permition_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT "Permition_name_key" UNIQUE (name);


--
-- Name: permission Permition_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT "Permition_pkey" PRIMARY KEY (id);


--
-- Name: road Road_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.road
    ADD CONSTRAINT "Road_pkey" PRIMARY KEY (id);


--
-- Name: role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (user_id, permission_id);


--
-- Name: account account_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: account account_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_username_key UNIQUE (username);


--
-- Name: assignment assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_pkey PRIMARY KEY (id);


--
-- Name: district distric_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.district
    ADD CONSTRAINT distric_pkey PRIMARY KEY (id);


--
-- Name: province province_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- Name: ward ward_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_pkey PRIMARY KEY (id);


--
-- Name: AccessRoad AccessRoad_fk0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."AccessRoad"
    ADD CONSTRAINT "AccessRoad_fk0" FOREIGN KEY (id_user) REFERENCES public."user"(user_id);


--
-- Name: AccessRoad AccessRoad_fk1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."AccessRoad"
    ADD CONSTRAINT "AccessRoad_fk1" FOREIGN KEY (id_road) REFERENCES public.road(id);


--
-- Name: role Role_fk1; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "Role_fk1" FOREIGN KEY (permission_id) REFERENCES public.permission(id);


--
-- Name: assignment assignment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: assignment assignment_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assignment
    ADD CONSTRAINT assignment_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(id) ON DELETE CASCADE;


--
-- Name: road road_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.road
    ADD CONSTRAINT road_district_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(id);


--
-- Name: road road_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.road
    ADD CONSTRAINT road_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: role role_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: user user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(id) ON DELETE CASCADE;


--
-- Name: ward ward_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.district(id) ON DELETE CASCADE;


--
-- Name: TABLE "AccessRoad"; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public."AccessRoad" TO dev;


--
-- Name: SEQUENCE "AccessRoad_id_road_seq"; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public."AccessRoad_id_road_seq" TO dev;


--
-- Name: SEQUENCE "AccessRoad_id_user_seq"; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public."AccessRoad_id_user_seq" TO dev;


--
-- Name: TABLE permission; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public.permission TO dev;


--
-- Name: SEQUENCE "Permition_id_seq"; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public."Permition_id_seq" TO dev;


--
-- Name: TABLE road; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public.road TO dev;


--
-- Name: SEQUENCE "Road_id_seq"; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public."Road_id_seq" TO dev;


--
-- Name: TABLE role; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public.role TO dev;


--
-- Name: SEQUENCE "Role_permition_id_seq"; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public."Role_permition_id_seq" TO dev;


--
-- Name: SEQUENCE "Role_user_id_seq"; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public."Role_user_id_seq" TO dev;


--
-- Name: TABLE account; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public.account TO dev;


--
-- Name: SEQUENCE account_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.account_id_seq TO dev;


--
-- Name: TABLE assignment; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public.assignment TO dev;


--
-- Name: SEQUENCE assignment_district_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.assignment_district_id_seq TO dev;


--
-- Name: SEQUENCE assignment_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.assignment_id_seq TO dev;


--
-- Name: SEQUENCE assignment_user_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.assignment_user_id_seq TO dev;


--
-- Name: TABLE ward; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public.ward TO dev;


--
-- Name: SEQUENCE ward_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.ward_id_seq TO dev;


--
-- Name: TABLE district; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public.district TO dev;


--
-- Name: TABLE province; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public.province TO dev;


--
-- Name: SEQUENCE province_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.province_id_seq TO dev;


--
-- Name: TABLE "user"; Type: ACL; Schema: public; Owner: admin
--

GRANT ALL ON TABLE public."user" TO dev;


--
-- Name: SEQUENCE user_user_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.user_user_id_seq TO dev;


--
-- Name: SEQUENCE ward_district_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.ward_district_id_seq TO dev;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO dev;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT ALL ON TABLES  TO dev;


--
-- PostgreSQL database dump complete
--

