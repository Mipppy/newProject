from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from variables import *
import time,os, random
if RUN_WINDOWLESS:
    os.environ['MOZ_HEADLESS'] = '1'

class SchooltoolDriver():
    dictionaryOfScrapedData = {}
    def __init__(self, password : str, username : str):
        self.password = password
        self.username = username
    
    def startDriver(self):
        self.options = webdriver.FirefoxOptions()
        self.driver = webdriver.Firefox(options=self.options) 
    
    def sendUserInfo(self):
        time.sleep(random.uniform(0.2, 0.6))
        self.driver.get(SCHOOLTOOL_URL)
        username_field = self.driver.find_element(By.ID, SCHOOLTOOL_USERNAME_FIELD_ID)
        password_field = self.driver.find_element(By.ID, SCHOOLTOOL_PASSWORD_FIELD_ID)
        login_button = self.driver.find_element(By.CSS_SELECTOR, SCHOOLTOOL_SUBMIT_BUTTON_CSS_SELECTOR)
        username_field.send_keys(self.username)
        password_field.send_keys(self.password)
        login_button.click()

    def quit(self):
        self.driver.quit()
    
    def waitUntilLoggedIn(self):
        wait = WebDriverWait(self.driver, MAX_DRIVER_SIGNIN_TIME)
        wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, f"span[title='{SCHOOLTOOL_HOME_PAGE_NAME_TITLE}']")))   
        element = self.driver.find_element(By.CSS_SELECTOR, f"span[title='{SCHOOLTOOL_HOME_PAGE_NAME_TITLE}']")
        time.sleep(SCHOOLTOOL_TIMEOUT_TO_AVOID_FAST_LOAD_GLITCH)
        element.click()
         
    def run(self):
        try:
            self.startDriver()
            self.sendUserInfo()
            self.waitUntilLoggedIn()
            self.scrape()
            print(self.dictionaryOfScrapedData)
            self.quit()
        except Exception as e:
            print(e)
            self.quit()
            return e
    
    def scrapeAssignments(self):
        self.driver.find_element(By.ID, ASSIGNMENT_TAB_ID).click()
        time.sleep(TAB_TRANSITION_TIMEOUT)
        self.dictionaryOfScrapedData["gradeHTML"] = self.driver.find_element(By.ID, GRADE_TABLE_ID).get_attribute("innerHTML")
        self.driver.find_element(By.ID, GRADE_AVERAGES_BUTTON_ID).click()
        time.sleep(TAB_TRANSITION_TIMEOUT)
        self.dictionaryOfScrapedData["averagesHTML"] = self.driver.find_element(By.ID, GRADE_AVERAGES_TABLE_ID).get_attribute("innerHTML")
        
    def scrapeBasicData(self):
        self.dictionaryOfScrapedData["pictureBase64"] = self.driver.find_element(By.ID, "PersonPhoto").get_attribute("src")
        self.dictionaryOfScrapedData["personDataHTML"] = self.driver.find_element(By.ID, USER_DATA_UL_ID).get_attribute("innerHTML")
    
    def scrapeAttendenceData(self):
        self.driver.find_element(By.ID, ATTENDENCE_TAB_ID).click()
        time.sleep(TAB_TRANSITION_TIMEOUT)
        self.dictionaryOfScrapedData["attendenceHTML"] = self.driver.find_element(By.ID, ATTENDENCE_TABLE_ID).get_attribute("innerHTML")
    
    def scrapeGrades(self):
        self.driver.find_element(By.ID, GRADES_TAB_ID).click()
        time.sleep(TAB_TRANSITION_TIMEOUT)
        self.dictionaryOfScrapedData["markingGradesHTML"] = self.driver.find_element(By.ID, MARKING_PERIOD_GRADE_TABLE_ID).get_attribute("innerHTML")
        
    # Scrapes the pure HTML/Base64 as quickly as possible.  Parsing the HTML can be taken care of client side to save server resources and load time.
    def scrape(self):
        self.scrapeBasicData()
        self.scrapeAttendenceData()
        self.scrapeGrades()
        
        #MUST scrape grades last.  Reading the averages MUST be the last thing to do, as it is impossible to leave the averages page once it is opened.
        self.scrapeAssignments()