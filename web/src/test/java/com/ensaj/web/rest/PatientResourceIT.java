package com.ensaj.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ensaj.IntegrationTest;
import com.ensaj.domain.Patient;
import com.ensaj.repository.PatientRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link PatientResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PatientResourceIT {

    private static final Instant DEFAULT_BIRTHDATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_BIRTHDATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_ADRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADRESS = "BBBBBBBBBB";

    private static final String DEFAULT_GENRE = "AAAAAAAAAA";
    private static final String UPDATED_GENRE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEPHONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEPHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/patients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MockMvc restPatientMockMvc;

    private Patient patient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patient createEntity() {
        Patient patient = new Patient()
            .birthdate(DEFAULT_BIRTHDATE)
            .adress(DEFAULT_ADRESS)
            .genre(DEFAULT_GENRE)
            .telephone(DEFAULT_TELEPHONE);
        return patient;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Patient createUpdatedEntity() {
        Patient patient = new Patient()
            .birthdate(UPDATED_BIRTHDATE)
            .adress(UPDATED_ADRESS)
            .genre(UPDATED_GENRE)
            .telephone(UPDATED_TELEPHONE);
        return patient;
    }

    @BeforeEach
    public void initTest() {
        patientRepository.deleteAll();
        patient = createEntity();
    }

    @Test
    void createPatient() throws Exception {
        int databaseSizeBeforeCreate = patientRepository.findAll().size();
        // Create the Patient
        restPatientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isCreated());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeCreate + 1);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getBirthdate()).isEqualTo(DEFAULT_BIRTHDATE);
        assertThat(testPatient.getAdress()).isEqualTo(DEFAULT_ADRESS);
        assertThat(testPatient.getGenre()).isEqualTo(DEFAULT_GENRE);
        assertThat(testPatient.getTelephone()).isEqualTo(DEFAULT_TELEPHONE);
    }

    @Test
    void createPatientWithExistingId() throws Exception {
        // Create the Patient with an existing ID
        patient.setId("existing_id");

        int databaseSizeBeforeCreate = patientRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPatientMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllPatients() throws Exception {
        // Initialize the database
        patientRepository.save(patient);

        // Get all the patientList
        restPatientMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(patient.getId())))
            .andExpect(jsonPath("$.[*].birthdate").value(hasItem(DEFAULT_BIRTHDATE.toString())))
            .andExpect(jsonPath("$.[*].adress").value(hasItem(DEFAULT_ADRESS)))
            .andExpect(jsonPath("$.[*].genre").value(hasItem(DEFAULT_GENRE)))
            .andExpect(jsonPath("$.[*].telephone").value(hasItem(DEFAULT_TELEPHONE)));
    }

    @Test
    void getPatient() throws Exception {
        // Initialize the database
        patientRepository.save(patient);

        // Get the patient
        restPatientMockMvc
            .perform(get(ENTITY_API_URL_ID, patient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(patient.getId()))
            .andExpect(jsonPath("$.birthdate").value(DEFAULT_BIRTHDATE.toString()))
            .andExpect(jsonPath("$.adress").value(DEFAULT_ADRESS))
            .andExpect(jsonPath("$.genre").value(DEFAULT_GENRE))
            .andExpect(jsonPath("$.telephone").value(DEFAULT_TELEPHONE));
    }

    @Test
    void getNonExistingPatient() throws Exception {
        // Get the patient
        restPatientMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingPatient() throws Exception {
        // Initialize the database
        patientRepository.save(patient);

        int databaseSizeBeforeUpdate = patientRepository.findAll().size();

        // Update the patient
        Patient updatedPatient = patientRepository.findById(patient.getId()).orElseThrow();
        updatedPatient.birthdate(UPDATED_BIRTHDATE).adress(UPDATED_ADRESS).genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);

        restPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPatient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPatient))
            )
            .andExpect(status().isOk());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getBirthdate()).isEqualTo(UPDATED_BIRTHDATE);
        assertThat(testPatient.getAdress()).isEqualTo(UPDATED_ADRESS);
        assertThat(testPatient.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testPatient.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void putNonExistingPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, patient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(patient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePatientWithPatch() throws Exception {
        // Initialize the database
        patientRepository.save(patient);

        int databaseSizeBeforeUpdate = patientRepository.findAll().size();

        // Update the patient using partial update
        Patient partialUpdatedPatient = new Patient();
        partialUpdatedPatient.setId(patient.getId());

        partialUpdatedPatient.birthdate(UPDATED_BIRTHDATE).telephone(UPDATED_TELEPHONE);

        restPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatient))
            )
            .andExpect(status().isOk());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getBirthdate()).isEqualTo(UPDATED_BIRTHDATE);
        assertThat(testPatient.getAdress()).isEqualTo(DEFAULT_ADRESS);
        assertThat(testPatient.getGenre()).isEqualTo(DEFAULT_GENRE);
        assertThat(testPatient.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void fullUpdatePatientWithPatch() throws Exception {
        // Initialize the database
        patientRepository.save(patient);

        int databaseSizeBeforeUpdate = patientRepository.findAll().size();

        // Update the patient using partial update
        Patient partialUpdatedPatient = new Patient();
        partialUpdatedPatient.setId(patient.getId());

        partialUpdatedPatient.birthdate(UPDATED_BIRTHDATE).adress(UPDATED_ADRESS).genre(UPDATED_GENRE).telephone(UPDATED_TELEPHONE);

        restPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPatient))
            )
            .andExpect(status().isOk());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
        Patient testPatient = patientList.get(patientList.size() - 1);
        assertThat(testPatient.getBirthdate()).isEqualTo(UPDATED_BIRTHDATE);
        assertThat(testPatient.getAdress()).isEqualTo(UPDATED_ADRESS);
        assertThat(testPatient.getGenre()).isEqualTo(UPDATED_GENRE);
        assertThat(testPatient.getTelephone()).isEqualTo(UPDATED_TELEPHONE);
    }

    @Test
    void patchNonExistingPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, patient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(patient))
            )
            .andExpect(status().isBadRequest());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPatient() throws Exception {
        int databaseSizeBeforeUpdate = patientRepository.findAll().size();
        patient.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPatientMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(patient)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Patient in the database
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePatient() throws Exception {
        // Initialize the database
        patientRepository.save(patient);

        int databaseSizeBeforeDelete = patientRepository.findAll().size();

        // Delete the patient
        restPatientMockMvc
            .perform(delete(ENTITY_API_URL_ID, patient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Patient> patientList = patientRepository.findAll();
        assertThat(patientList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
