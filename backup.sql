--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: FacilityStaff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FacilityStaff" (
    id text NOT NULL,
    name text
);


ALTER TABLE public."FacilityStaff" OWNER TO postgres;

--
-- Name: Resident; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Resident" (
    id text NOT NULL,
    name text
);


ALTER TABLE public."Resident" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    role text,
    email text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Data for Name: FacilityStaff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FacilityStaff" (id, name) FROM stdin;
\.


--
-- Data for Name: Resident; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resident" (id, name) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, role, email) FROM stdin;
1	Thato	\N	\N
2	Jack	\N	\N
3	Phathu	\N	\N
4	Vuyo	\N	\N
hhhhhhhkk	khongela@gmail.com	\N	khongi
luE9NkbFboguIv7CiXqwbQVXvau1	fsjack	\N	msesenyanelevi@gmail.com
\.


--
-- Name: FacilityStaff FacilityStaff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FacilityStaff"
    ADD CONSTRAINT "FacilityStaff_pkey" PRIMARY KEY (id);


--
-- Name: Resident Resident_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resident"
    ADD CONSTRAINT "Resident_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

