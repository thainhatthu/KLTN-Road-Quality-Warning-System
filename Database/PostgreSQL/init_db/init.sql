-- PostgreSQL database dump

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
-- Name: assignment_ward_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.assignment_ward_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.assignment_ward_id_seq OWNER TO admin;

--
-- Name: assignment_ward_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.assignment_ward_id_seq OWNED BY public.assignment.ward_id;


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
    province_id integer NOT NULL
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

ALTER TABLE ONLY public.assignment ALTER COLUMN ward_id SET DEFAULT nextval('public.assignment_ward_id_seq'::regclass);


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
Tuyên Quang	1
Cao Bằng	2
Lai Châu	3
Lào Cai	4
Thái Nguyên	5
Điện Biên	6
Lạng Sơn	7
Sơn La	8
Phú Thọ	9
Bắc Ninh	10
Quảng Ninh	11
Thành phố Hà Nội	12
Thành phố Hải Phòng	13
Hưng Yên	14
Ninh Bình	15
Thanh Hóa	16
Nghệ An	17
Hà Tĩnh	18
Quảng Trị	19
Thành phố Huế	20
Thành phố Đà Nẵng	21
Quảng Ngãi	22
Gia Lai	23
Đắk Lắk	24
Khánh Hoà	25
Lâm Đồng	26
Đồng Nai	27
Tây Ninh	28
Thành phố Hồ Chí Minh	29
Đồng Tháp	30
An Giang	31
Vĩnh Long	32
Thành phố Cần Thơ	33
Cà Mau	34
\.

--
-- Data for Name: ward; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ward (id, name, province_id) FROM stdin;
1	Phường Hiệp Bình	29
2	Phường Tam Bình	29
3	Phường Thủ Đức	29
4	Phường Linh Xuân	29
5	Phường Long Bình	29
6	Phường Tăng Nhơn Phú	29
7	Phường Phước Long	29
8	Phường Long Phước	29
9	Phường Long Trường	29
10	Phường An Khánh	29
11	Phường Bình Trưng	29
12	Phường Cát Lái	29
13	Phường Tân Định	29
14	Phường Sài Gòn	29
15	Phường Bến Thành	29
16	Phường Cầu Ông Lãnh	29
17	Phường Xuân Hòa	29
18	Phường Nhiêu Lộc	29
19	Phường Bàn Cờ	29
20	Phường Vĩnh Hội	29
21	Phường Khánh Hội	29
22	Phường Xóm Chiếu	29
23	Phường Chợ Quán	29
24	Phường An Đông	29
25	Phường Chợ Lớn	29
26	Phường Bình Tiên	29
27	Phường Bình Tây	29
28	Phường Bình Phú	29
29	Phường Phú Lâm	29
30	Phường Tân Mỹ	29
31	Phường Phú Thuận	29
32	Phường Tân Hưng	29
33	Phường Tân Thuận	29
34	Phường Chánh Hưng	29
35	Phường Bình Đông	29
36	Phường Phú Định	29
37	Phường Vườn Lài	29
38	Phường Diên Hồng	29
39	Phường Hòa Hưng	29
40	Phường Minh Phụng	29
41	Phường Bình Thới	29
42	Phường Hòa Bình	29
43	Phường Phú Thọ	29
44	Phường Đông Hưng Thuận	29
45	Phường Trung Mỹ Tây	29
46	Phường Tân Thới Hiệp	29
47	Phường Thới An	29
48	Phường An Phú Đông	29
49	Phường Gia Định	29
50	Phường Bình Thạnh	29
51	Phường Bình Lợi Trung	29
52	Phường Thạnh Mỹ Tây	29
53	Phường Bình Quới	29
54	Phường Bình Tân	29
55	Phường Bình Hưng Hòa	29
56	Phường Bình Trị Đông	29
57	Phường An Lạc	29
58	Phường Tân Tạo	29
59	Phường Hạnh Thông	29
60	Phường An Nhơn	29
61	Phường Gò Vấp	29
62	Phường Thông Tây Hội	29
63	Phường An Hội Tây	29
64	Phường An Hội Đông	29
65	Phường Đức Nhuận	29
66	Phường Cầu Kiệu	29
67	Phường Phú Nhuận	29
68	Phường Tây Thạnh	29
69	Phường Tân Sơn Nhì	29
70	Phường Phú Thọ Hòa	29
71	Phường Phú Thạnh	29
72	Phường Tân Phú	29
73	Phường Tân Sơn Hòa	29
74	Phường Tân Sơn Nhất	29
75	Phường Tân Hòa	29
76	Phường Bảy Hiền	29
77	Phường Tân Bình	29
78	Phường Tân Sơn	29
79	Xã Vĩnh Lộc	29
80	Xã Tân Vĩnh Lộc	29
81	Xã Bình Lợi	29
82	Xã Tân Nhựt	29
83	Xã Bình Chánh	29
84	Xã Hưng Long	29
85	Xã Bình Hưng	29
86	Xã An Nhơn Tây	29
87	Xã Thái Mỹ	29
88	Xã Nhuận Đức	29
89	Xã Tân An Hội	29
90	Xã Củ Chi	29
91	Xã Phú Hòa Đông	29
92	Xã Bình Mỹ	29
93	Xã Bình Khánh	29
94	Xã An Thới Đông	29
95	Xã Cần Giờ	29
96	Xã Thạnh An	29
97	Xã Đông Thạnh	29
98	Xã Hóc Môn	29
99	Xã Xuân Thới Sơn	29
100	Xã Bà Điểm	29
101	Xã Nhà Bè	29
102	Xã Hiệp Phước	29
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
-- Name: assignment_ward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.assignment_ward_id_seq', 1, true);


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

ALTER TABLE public.ward
    ADD CONSTRAINT ward_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(id) ON DELETE CASCADE;

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
-- Name: road road_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.road
    ADD CONSTRAINT road_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(id);


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
-- Name: SEQUENCE assignment_ward_id_seq; Type: ACL; Schema: public; Owner: admin
--

GRANT SELECT,USAGE ON SEQUENCE public.assignment_ward_id_seq TO dev;


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
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT SELECT,USAGE ON SEQUENCES  TO dev;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE admin IN SCHEMA public GRANT ALL ON TABLES  TO dev;