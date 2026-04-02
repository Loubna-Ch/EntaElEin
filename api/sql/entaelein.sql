BEGIN;

-- 1. Region Table
CREATE TABLE IF NOT EXISTS public.region (
    regionid SERIAL NOT NULL,
    regionname character varying(100) NOT NULL,
    CONSTRAINT region_pkey PRIMARY KEY (regionid)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'region_name_check') THEN
        ALTER TABLE public.region ADD CONSTRAINT region_name_check CHECK (regionname IN (
            'Tripoli - El Mina', 'Tripoli - Abi Samra', 'Tripoli - El Tell', 
            'Tripoli - Qalamoun', 'Tripoli - Bab al-Tabbaneh', 'Tripoli - Jabal Mohsen', 
            'Tripoli - Azmi', 'Tripoli - Dam wa Farez', 'Tripoli - Bahsas',
            'Beirut', 'Baabda', 'Matn', 'Shouf', 'Aley', 'Keserwan', 'Jbeil',
            'Akkar', 'Koura', 'Zgharta', 'Bsharri', 'Batroun', 'Minieh-Dannieh',
            'Zahlé', 'West Beqaa', 'Rashaya', 'Baalbek', 'Hermel',
            'Sidon', 'Tyre', 'Jezzine', 'Nabatieh', 'Marjeyoun', 'Hasbaya', 'Bint Jbeil'
        ));
    END IF;
END $$;

-- 2. User Table
CREATE TABLE IF NOT EXISTS public."User" (
    userid SERIAL NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    phonenumber character varying(20),
    address text,
    dateofbirth date,
    registrationdate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(20) DEFAULT 'Citizen',
    regionid integer,
    CONSTRAINT "User_pkey" PRIMARY KEY (userid),
    CONSTRAINT "User_email_key" UNIQUE (email),
    CONSTRAINT "User_username_key" UNIQUE (username)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_role_check') THEN
        ALTER TABLE public."User" ADD CONSTRAINT "User_role_check" CHECK (role IN ('Citizen', 'Officer', 'Admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_password_min_length') THEN
        ALTER TABLE public."User" ADD CONSTRAINT "User_password_min_length" CHECK (char_length(password) >= 6);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'User_regionid_fkey') THEN
        ALTER TABLE public."User" ADD CONSTRAINT "User_regionid_fkey" FOREIGN KEY (regionid) REFERENCES public.region (regionid) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Hadas (Incident Category) Table
CREATE TABLE IF NOT EXISTS public.hadas (
    hadasid SERIAL NOT NULL,
    hadasdescription text NOT NULL,
    CONSTRAINT hadas_pkey PRIMARY KEY (hadasid)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'hadas_description_check'
          AND conrelid = 'public.hadas'::regclass
    ) THEN
        ALTER TABLE public.hadas 
            ADD CONSTRAINT hadas_description_check 
            CHECK (hadasdescription IN (
                -- Violent Crimes
                'Assault', 'Armed Robbery', 'Homicide', 'Kidnapping', 'Domestic Violence',
                
                -- Property Crimes
                'Theft', 'Burglary', 'Vandalism', 'Arson', 'Shoplifting', 'Motor Vehicle Theft',
                
                -- Public Safety & Disorder
                'Harassment', 'Suspicious Activity', 'Drug-Related Activity', 'Public Intoxication', 
                'Disorderly Conduct', 'Weapon Possession', 'Cybercrime',
                
                -- Traffic & Transportation
                'Traffic Accident', 'Hit and Run', 'Reckless Driving', 'DUI',
                
                -- Natural Disasters & Environmental
                'Earthquake', 'Flood', 'Wildfire', 'Storm/Hurricane', 'Landslide', 'Extreme Heat',
                
                -- Other
                'Missing Person', 'Medical Emergency', 'Other'
            ));
    END IF;
END $$;

-- 4. AlertFromAI Table
CREATE TABLE IF NOT EXISTS public.alertfromai (
    alertid SERIAL NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    hadasid integer NOT NULL,
    CONSTRAINT alertfromai_pkey PRIMARY KEY (alertid)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alertfromai_hadasid_fkey') THEN
        ALTER TABLE public.alertfromai ADD CONSTRAINT alertfromai_hadasid_fkey FOREIGN KEY (hadasid) REFERENCES public.hadas (hadasid) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. AlertedBy (Join Table)
CREATE TABLE IF NOT EXISTS public.alertedby (
    userid integer NOT NULL,
    alertid integer NOT NULL,
    sentat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT alertedby_pkey PRIMARY KEY (userid, alertid)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alertedby_alertid_fkey') THEN
        ALTER TABLE public.alertedby ADD CONSTRAINT alertedby_alertid_fkey FOREIGN KEY (alertid) REFERENCES public.alertfromai (alertid) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alertedby_userid_fkey') THEN
        ALTER TABLE public.alertedby ADD CONSTRAINT alertedby_userid_fkey FOREIGN KEY (userid) REFERENCES public."User" (userid) ON DELETE CASCADE;
    END IF;
END $$;

-- 6. CrimeReport Table
CREATE TABLE IF NOT EXISTS public.crimereport (
    reportid SERIAL NOT NULL,
    crimedate date NOT NULL,
    reportdate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    description varchar(1000) NOT NULL,
    status character varying(50) DEFAULT 'Pending',
    image_url text,
    userid integer,
    regionid integer,
    hadasid integer,
    CONSTRAINT crimereport_pkey PRIMARY KEY (reportid)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'crimereport_status_check') THEN
        ALTER TABLE public.crimereport ADD CONSTRAINT crimereport_status_check CHECK (status IN ('Pending', 'In Progress', 'Resolved'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'crimereport_hadasid_fkey') THEN
        ALTER TABLE public.crimereport ADD CONSTRAINT crimereport_hadasid_fkey FOREIGN KEY (hadasid) REFERENCES public.hadas (hadasid) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'crimereport_regionid_fkey') THEN
        ALTER TABLE public.crimereport ADD CONSTRAINT crimereport_regionid_fkey FOREIGN KEY (regionid) REFERENCES public.region (regionid);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'crimereport_userid_fkey') THEN
        ALTER TABLE public.crimereport ADD CONSTRAINT crimereport_userid_fkey FOREIGN KEY (userid) REFERENCES public."User" (userid) ON DELETE SET NULL;
    END IF;
END $$;

-- 7. Participant Table
CREATE TABLE IF NOT EXISTS public.participant (
    participantid SERIAL NOT NULL,
    participantname character varying(100),
    description text,
    pdateofbirth date,
    gender character varying(10),
    participanttype character varying(30) NOT NULL,
    CONSTRAINT participant_pkey PRIMARY KEY (participantid)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'participant_gender_check') THEN
        ALTER TABLE public.participant ADD CONSTRAINT participant_gender_check CHECK (gender IN ('Male', 'Female'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'participant_type_check') THEN
        ALTER TABLE public.participant ADD CONSTRAINT participant_type_check CHECK (participanttype IN ('Person', 'Object', 'Natural_Event', 'Crime_Entity', 'Other'));
    END IF;
END $$;

-- 8. InvolvedIn (Join Table)
CREATE TABLE IF NOT EXISTS public.involvedin (
    participantid integer NOT NULL,
    reportid integer NOT NULL,
    CONSTRAINT involvedin_pkey PRIMARY KEY (participantid, reportid)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'involvedin_participantid_fkey') THEN
        ALTER TABLE public.involvedin ADD CONSTRAINT involvedin_participantid_fkey FOREIGN KEY (participantid) REFERENCES public.participant (participantid) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'involvedin_reportid_fkey') THEN
        ALTER TABLE public.involvedin ADD CONSTRAINT involvedin_reportid_fkey FOREIGN KEY (reportid) REFERENCES public.crimereport (reportid) ON DELETE CASCADE;
    END IF;
END $$;

-- 9. Feedback Table
CREATE TABLE IF NOT EXISTS public.feedback (
    feedbackid SERIAL NOT NULL,
    content varchar(1000),
    rating integer NOT NULL,
    dateposted timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    userid integer,
    CONSTRAINT feedback_pkey PRIMARY KEY (feedbackid)
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'feedback_userid_fkey') THEN
        ALTER TABLE public.feedback ADD CONSTRAINT feedback_userid_fkey FOREIGN KEY (userid) REFERENCES public."User" (userid) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'feedback_rating_check') THEN
        ALTER TABLE public.feedback ADD CONSTRAINT feedback_rating_check CHECK (rating >= 1 AND rating <= 5);
    END IF;
END $$;

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_user_regionid ON public."User"(regionid);
CREATE INDEX IF NOT EXISTS idx_crimereport_userid ON public.crimereport(userid);
CREATE INDEX IF NOT EXISTS idx_crimereport_regionid ON public.crimereport(regionid);

COMMIT;